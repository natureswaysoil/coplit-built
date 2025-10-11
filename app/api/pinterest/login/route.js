export async function GET(request) {
  const url = new URL(request.url);
  const isLocal = url.searchParams.get('env') === 'local';

  const clientId = process.env.PINTEREST_APP_ID;
  const redirectUri = isLocal
    ? process.env.PINTEREST_REDIRECT_URI_LOCAL
    : process.env.PINTEREST_REDIRECT_URI;

  const scope = [
    'boards:read',
    'pins:read',
    'user_accounts:read'
    // Add 'pins:write','boards:write' later if you plan to demo creating pins
  ].join(',');

  const state = Math.random().toString(36).slice(2);

  // Set CSRF state cookie
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `pin_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const auth = new URL('https://www.pinterest.com/oauth/');
  auth.searchParams.set('client_id', clientId);
  auth.searchParams.set('redirect_uri', redirectUri);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('scope', scope);
  auth.searchParams.set('state', state);

  return new Response(null, { status: 302, headers: { ...headers, Location: auth.toString() } });
}
