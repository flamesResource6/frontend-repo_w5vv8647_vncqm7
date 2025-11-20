export default function StatsCard({ title, value, subtitle }) {
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="text-blue-300/80 text-sm mb-1">{title}</div>
      <div className="text-3xl font-semibold text-white">{value}</div>
      {subtitle && <div className="text-xs text-blue-300/60 mt-1">{subtitle}</div>}
    </div>
  )
}
