import dynamic from 'next/dynamic';
const AuthScreen = dynamic(() => Promise.resolve(() =>
  <main style={{ padding: 24 }}>
    <h1>/auth</h1>
    <p>Pages Router page loaded.</p>
  </main>
), { ssr: false });

export default function Page() {
  return <AuthScreen />;
}


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Auth() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMsg(error ? error.message : 'Check your email for the login link!');
  };

  return (
    <main>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn} style={{ marginBottom: 16 }}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign In</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
