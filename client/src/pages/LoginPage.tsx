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
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Welcome back</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Login</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button type="submit" className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-400">
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-400">
        Need an account?{' '}
        <Link to="/register" className="text-indigo-300">
          Create one
        </Link>
      </p>
    </div>
  )
}
