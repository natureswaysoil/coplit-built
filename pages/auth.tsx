import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Auth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValidEmail = (value: string) => {
    // Simple RFC5322-inspired check; keeps it lightweight
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithOtp({ email });
      if (signInError) {
        setError(signInError.message);
      } else {
        setSuccess('Check your inbox for the sign-in link. If you do not see it, check your spam folder.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn} style={{ marginBottom: 16, display: 'grid', gap: 12, maxWidth: 360 }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
          aria-invalid={!!error}
          aria-describedby="auth-message"
        />
        <button type="submit" disabled={loading || !isValidEmail(email)}>
          {loading ? 'Sending…' : 'Send Sign-In Link'}
        </button>
      </form>
      <div id="auth-message" aria-live="polite" style={{ minHeight: 20 }}>
        {error && <p style={{ color: '#b00020' }}>{error}</p>}
        {success && <p style={{ color: '#0f7b0f' }}>{success}</p>}
      </div>
    </main>
  );
}
