import { Bell, CheckCircle } from 'lucide-react'

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Title */}
      <div>
        <h2 className="text-xl font-semibold text-hti-navy">Mission Control</h2>
        <p className="text-sm text-gray-500">Real-time operational intelligence for HTI</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{today}</span>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
          <CheckCircle size={16} />
          System Status: Healthy
        </button>

        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
