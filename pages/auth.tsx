import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
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
