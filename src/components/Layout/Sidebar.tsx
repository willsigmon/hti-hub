import { NavLink } from 'react-router-dom'
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
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/budget', icon: DollarSign, label: 'Budget Gap' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/donors', icon: Users, label: 'Donors' },
  { to: '/grants', icon: FileText, label: 'Grants' },
  { to: '/leads', icon: Target, label: 'Lead Gen' },
  { to: '/automations', icon: Zap, label: 'Automations' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/mail', icon: Mail, label: 'Mail' },
  { to: '/crm', icon: Database, label: 'CRM' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-hti-navy min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-hti-navy-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-hti-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">H.U.B.</h1>
            <p className="text-hti-navy-light text-xs">Helping Us Build</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-hti-orange text-white'
                      : 'text-gray-300 hover:bg-hti-navy-light hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-hti-navy-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-hti-orange rounded-full flex items-center justify-center text-white font-semibold">
            WS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Will Sigmon</p>
            <p className="text-gray-400 text-xs truncate">Director of BD</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
