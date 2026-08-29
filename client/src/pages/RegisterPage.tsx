import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../lib/mockData'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please complete all fields.')
      return
    }

    const user = registerUser(form.name, form.email, form.password)

    if (!user) {
      setError('An account with that email already exists.')
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Create account</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Register</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Name</label>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button type="submit" className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-400">
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  )
}
