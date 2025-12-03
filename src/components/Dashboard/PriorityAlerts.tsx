import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface Alert {
  id: string
  title: string
  description: string
  type: 'critical' | 'warning' | 'info'
}

const alerts: Alert[] = [
  {
    id: '1',
    title: 'Budget Gap Critical',
    description: '$85k deficit projected for Q1 2026. Immediate action required on Equipment Sales.',
    type: 'critical',
  },
  {
    id: '2',
    title: 'Grant Deadline',
    description: 'NC Digital Equity Grant due in 3 days. Narrative draft pending review.',
    type: 'warning',
  },
  {
    id: '3',
    title: 'New Lead Detected',
    description: 'Cisco Systems CSR program matches HTI profile (92% Fit Score).',
    type: 'info',
  },
]

export default function PriorityAlerts() {
  const alertStyles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      badge: 'bg-red-100 text-red-700',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-700',
    },
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-hti-navy mb-4">Priority Alerts</h3>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const styles = alertStyles[alert.type]
          const Icon = styles.icon

          return (
            <div
              key={alert.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex gap-3`}
            >
              <Icon className={styles.iconColor} size={20} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}>
                    {alert.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
