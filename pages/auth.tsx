import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link!')
  }

  return (
    <div>
      <h1>Sign In</h1>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email"
      />
      <button onClick={signIn}>Send Login Link</button>
      <p>{message}</p>
    </div>
  )
}