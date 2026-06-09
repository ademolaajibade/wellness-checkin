interface Props {
  label: string
  value: string | number
  sub?: string
  highlight?: boolean
}

export default function StatCard({ label, value, sub, highlight }: Props) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-100'}`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${highlight ? 'text-rose-600' : 'text-gray-800'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
