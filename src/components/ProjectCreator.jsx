import { useEffect, useState } from 'react'

const api = () => (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')

export default function ProjectCreator({ onCreated }) {
  const [name, setName] = useState('My API')
  const [slug, setSlug] = useState('my-api')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const create = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${api()}/api/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug, description }) })
      if (!res.ok) throw new Error('Failed to create project')
      const data = await res.json()
      onCreated && onCreated({ id: data.id, name, slug })
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" className="col-span-1 bg-slate-900/60 border border-slate-700 text-white rounded px-3 py-2"/>
          <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="slug" className="col-span-1 bg-slate-900/60 border border-slate-700 text-white rounded px-3 py-2"/>
          <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="col-span-1 bg-slate-900/60 border border-slate-700 text-white rounded px-3 py-2"/>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button onClick={create} disabled={loading} className="self-start bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">{loading? 'Creating...' : 'Create Project'}</button>
      </div>
    </div>
  )
}
