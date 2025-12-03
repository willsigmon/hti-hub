'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
  FileText,
  Target,
  Zap,
  Calendar,
  Mail,
  Database,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Overview' },
  { href: '/budget-gap', icon: DollarSign, label: 'Budget Gap' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/donors', icon: Users, label: 'Donors' },
  { href: '/grants', icon: FileText, label: 'Grants' },
  { href: '/leads', icon: Target, label: 'Lead Gen' },
  { href: '/automations', icon: Zap, label: 'Automations' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/mail', icon: Mail, label: 'Mail' },
  { href: '/crm', icon: Database, label: 'CRM' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside data-tour="sidebar" className="w-64 bg-sidebar min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg border-glow">
            H
          </div>
          <div>
            <h1 className="text-foreground font-bold text-lg">H.U.B.</h1>
            <p className="text-muted-foreground text-xs">Helping Us Build</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 scrollbar-thin overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg border-glow'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold shadow-lg">
            WS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">Will Sigmon</p>
            <p className="text-muted-foreground text-xs truncate">Director of BD</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
