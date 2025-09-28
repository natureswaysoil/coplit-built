import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const checkSession = () => {
      try {
        const adminSession = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin-session='))
          ?.split('=')[1]
        
        if (adminSession) {
          const sessionData = JSON.parse(decodeURIComponent(adminSession))
          if (sessionData.expires && Date.now() < sessionData.expires) {
            router.push('/admin/dashboard')
            return
          }
        }
      } catch {
        // Invalid session, continue to login
      }
    }
    
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Set session cookie
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        const sessionData = {
          authenticated: true,
          expires: expires.getTime(),
          timestamp: Date.now()
        }
        
        document.cookie = `admin-session=${encodeURIComponent(JSON.stringify(sessionData))}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
        
        // Redirect to dashboard
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setError('')
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f4f9f5 0%, #e8f3ec 100%)'
    }}>
      <Head>
        <title>Admin Login - Nature's Way Soil</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e1eee4'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#174F2E',
            marginBottom: '8px'
          }}>
            Admin Access
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '14px',
            margin: 0
          }}>
            Enter your admin password to continue
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#174F2E',
              fontSize: '14px'
            }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1eee4',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#174F2E'}
              onBlur={(e) => e.target.style.borderColor = '#e1eee4'}
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '12px',
              background: loading || !password ? '#9ca3af' : '#174F2E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#174F2E',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear session
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '12px',
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          <strong>🔒 Security Notice:</strong> This admin panel is now protected. 
          Sessions expire after 24 hours for security.
        </div>
      </div>
    </main>
  )
}
