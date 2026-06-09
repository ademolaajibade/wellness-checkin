export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-6 h-6 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
