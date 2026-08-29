import { useState } from 'react'
import { getCurrentUser, getUsers } from '../lib/mockData'

export default function ProfilePage() {
  const currentUser = getCurrentUser()
  const [name, setName] = useState(currentUser?.name ?? '')

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Login required</h1>
        <p className="mt-3 text-slate-300">Please sign in to view your profile.</p>
      </div>
    )
  }

  const handleSave = () => {
    const users = getUsers().map((user) =>
      user.id === currentUser.id ? { ...user, name } : user,
    )

    const stored = JSON.parse(window.localStorage.getItem('event-management-state-v1') || '{}')
    stored.users = users
    window.localStorage.setItem('event-management-state-v1', JSON.stringify(stored))
    window.location.reload()
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-white">Profile</h1>
      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
          />
        </div>
        <button onClick={handleSave} className="rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400">
          Save profile
        </button>
      </div>
    </div>
  )
}
