import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/mockData'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('attendee@example.com')
  const [password, setPassword] = useState('attendee123')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const user = loginUser(email, password)

    if (!user) {
      setError('Invalid email or password.')
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-visual">
          <div className="visual-header">
            <div className="brand-mark">E</div>
            <span>Event hub</span>
          </div>

          <div className="visual-card">
            <p className="visual-tag">Trending this week</p>
            <h2>Sunset Live</h2>
            <p>12 Aug • Bengaluru • From ₹899</p>
          </div>

          <div className="visual-stats">
            <div>
              <strong>12k+</strong>
              <span>bookings</span>
            </div>
            <div>
              <strong>4.9★</strong>
              <span>rating</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-mark small">E</div>
            <span>BookMyEvent</span>
          </div>

          <div className="auth-copy">
            <p className="eyebrow">Welcome back</p>
            <h1>Login to continue</h1>
            <p>Discover events, book tickets, and manage your plans in one place.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label htmlFor="email">Email or phone</label>
              <input
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="field-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-link">Forgot Password?</Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <div className="social-row">
            <button className="social-btn">Google</button>
            <button className="social-btn">Apple</button>
          </div>

          <p className="signup-text">
            Don’t have an account?{' '}
            <Link to="/register" className="text-link strong">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
