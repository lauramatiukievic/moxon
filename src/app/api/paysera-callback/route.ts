export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log('data param:', searchParams.get('data'));
  console.log('ss1 param:', searchParams.get('ss1'));
  console.log('ss2 param:', searchParams.get('ss2'));
  //TODO: if paid, set order isPaid: true
  return new Response('OK');
}
