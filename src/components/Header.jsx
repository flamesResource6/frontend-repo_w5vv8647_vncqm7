import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/') }>
        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
          <span className="text-blue-300 font-bold">API</span>
        </div>
        <div>
          <div className="text-white font-semibold leading-tight">Pulse Monitor</div>
          <div className="text-xs text-blue-300/70 -mt-0.5">Track requests, errors, latency</div>
        </div>
      </div>
      <a href="/test" className="text-sm text-blue-300 hover:text-white transition">Connection Test</a>
    </div>
  )
}
