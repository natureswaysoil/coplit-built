import { cookies } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) return new Response('Missing code', { status: 400 });

  // Verify CSRF state
  const cookieStore = cookies();
  const cookieState = cookieStore.get('pin_state')?.value;
  if (!cookieState || cookieState !== state) {
    return new Response('Invalid state', { status: 400 });
  }

  // Determine which redirect URI was used
  const thisOrigin = `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`;
  const redirectUri = thisOrigin.includes('localhost') || thisOrigin.includes('127.0.0.1')
    ? process.env.PINTEREST_REDIRECT_URI_LOCAL
    : process.env.PINTEREST_REDIRECT_URI;

  const basic = Buffer.from(
    `${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`
  ).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  });

  const r = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  const data = await r.json();

  if (!r.ok) {
    return new Response(JSON.stringify(data, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Store access token (demo: cookie; production: DB/session)
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `pin_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 4}`
  );
  headers.append('Location', '/pinterest');

  return new Response(null, { status: 302, headers });
}
