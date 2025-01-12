export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  console.log('paysera callback: ', request)
}
