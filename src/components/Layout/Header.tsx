'use client'

import { Bell, CheckCircle } from 'lucide-react'

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-background/50 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
      {/* Left: Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground font-heading">Mission Control</h2>
        <p className="text-sm text-muted-foreground">Real-time operational intelligence for HTI</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{today}</span>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-status-success/20 text-status-success rounded-full text-sm border border-status-success/30">
          <CheckCircle size={16} />
          System Status: Healthy
        </button>

        <button className="relative p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-critical rounded-full animate-pulse"></span>
        </button>
      </div>
    </header>
  )
}
