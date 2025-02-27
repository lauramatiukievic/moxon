import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

export async function GET(request: Request) {
  // Call your signOut function to modify cookies/session data
  await signOut();

  // Redirect the user to the homepage (or any other page)
  return NextResponse.redirect(new URL('/', request.url));
}