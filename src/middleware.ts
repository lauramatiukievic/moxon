import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (!process.env.WP_USER || !process.env.WP_APP_PASS) {
    return NextResponse.next();
  }

  const basicAuth = `${process.env.WP_USER}:${process.env.WP_APP_PASS}`;

  const pathNameWithoutTrailingSlash = request.nextUrl.pathname.replace(
    /\/$/,
    "",
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/redirection/v1/redirect/?filterBy%5Burl-match%5D=plain&filterBy%5Burl%5D=${pathNameWithoutTrailingSlash}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(basicAuth).toString("base64")}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (data?.items?.length > 0) {
    const redirect = data.items.find(
      (item: any) => item.url === pathNameWithoutTrailingSlash,
    );

    if (!redirect) {
      return NextResponse.next();
    }

    const newUrl = new URL(
      redirect.action_data.url,
      process.env.NEXT_PUBLIC_BASE_URL,
    ).toString();

    return NextResponse.redirect(newUrl, {
      status: redirect.action_code === 301 ? 308 : 307,
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (`api`)
     * - Static files (`_next/static`)
     * - Image optimization files (`_next/image`)
     * - Metadata files (`favicon.ico`, `sitemap.xml`, `robots.txt`)
     * - Logout route
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logout).*)',
  ],
}
