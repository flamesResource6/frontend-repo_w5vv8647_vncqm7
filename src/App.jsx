import { useEffect, useState } from 'react'
import Header from './components/Header'
import ProjectCreator from './components/ProjectCreator'
import StatsCard from './components/StatsCard'

const api = () => (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')

function App() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(null)

  const loadProjects = async () => {
    const res = await fetch(`${api()}/api/projects`)
    const data = await res.json()
    setProjects(data)
    if (!selected && data[0]) setSelected(data[0])
  }

  const loadStats = async (project) => {
    if (!project) return
    const res = await fetch(`${api()}/api/projects/${project.id}/stats`)
    const data = await res.json()
    setStats(data)
  }

  useEffect(() => { loadProjects() }, [])
  useEffect(() => { loadStats(selected) }, [selected])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <Header />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white text-lg font-semibold">Projects</div>
                <button onClick={loadProjects} className="text-sm text-blue-300 hover:text-white">Refresh</button>
              </div>
              {projects.length === 0 ? (
                <div className="text-blue-300/80 text-sm">No projects yet. Create one on the right.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {projects.map(p => (
                    <button key={p.id} onClick={() => setSelected(p)} className={`text-left p-3 rounded border ${selected?.id===p.id? 'border-blue-400/40 bg-blue-400/10' : 'border-blue-500/20 bg-slate-900/40'} hover:border-blue-400/50 transition`}>
                      <div className="text-white font-medium">{p.name}</div>
                      <div className="text-xs text-blue-300/70">/{p.slug}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatsCard title="Total Requests" value={stats?.total ?? '-'} />
              <StatsCard title="Errors" value={stats?.errors ?? '-'} subtitle={stats? Math.round(((stats.errors||0)/(stats.total||1))*100)+'% error rate' : ''} />
              <StatsCard title="Avg Latency" value={stats? `${Math.round(stats.avg_latency)} ms` : '-'} />
            </div>

            <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6">
              <div className="text-white font-semibold mb-2">Integration</div>
              <p className="text-blue-300/80 text-sm mb-3">Send events from your API to start tracking.</p>
              <pre className="bg-slate-900/60 text-blue-100 p-4 rounded text-sm overflow-auto"><code>{`POST ${api()}/ingest
{
  "project_slug": "${selected?.slug || 'my-api'}",
  "api_key": "<optional-key>",
  "method": "GET",
  "path": "/v1/users",
  "status": 200,
  "latency_ms": 123.4
}`}</code></pre>
            </div>
          </div>

          <div className="space-y-6">
            <ProjectCreator onCreated={() => loadProjects()} />

            {selected && (
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
                <div className="text-white font-semibold mb-2">Create API Key</div>
                <CreateKey project={selected} onCreated={() => {}} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateKey({ project, onCreated }) {
  const [name, setName] = useState('Default')
  const [loading, setLoading] = useState(false)
  const [lastKey, setLastKey] = useState('')

  const create = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${api()}/api/keys`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: project.id, name }) })
      if (!res.ok) throw new Error('Failed to create key')
      const data = await res.json();
      setLastKey(data.key)
      onCreated && onCreated()
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Key name" className="flex-1 bg-slate-900/60 border border-slate-700 text-white rounded px-3 py-2"/>
        <button onClick={create} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50">{loading ? 'Creating...' : 'Create'}</button>
      </div>
      {lastKey && (
        <div className="text-xs text-blue-300/80 break-all">New key: <span className="text-white font-mono">{lastKey}</span></div>
      )}
    </div>
  )
}

export default App
