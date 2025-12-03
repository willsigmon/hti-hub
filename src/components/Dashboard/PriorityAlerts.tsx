import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

interface Alert {
  id: string
  title: string
  description: string
  type: 'critical' | 'warning' | 'info'
  action?: string
}

const alerts: Alert[] = [
  {
    id: '1',
    title: 'Budget Gap Critical',
    description: '$85k deficit projected for Q1 2026. Immediate action required on Equipment Sales.',
    type: 'critical',
    action: 'View Budget',
  },
  {
    id: '2',
    title: 'Grant Deadline',
    description: 'NC Digital Equity Grant due in 3 days. Narrative draft pending review.',
    type: 'warning',
    action: 'Open Grant',
  },
  {
    id: '3',
    title: 'New Lead Detected',
    description: 'Cisco Systems CSR program matches HTI profile (92% Fit Score).',
    type: 'info',
    action: 'View Lead',
  },
]

export default function PriorityAlerts() {
  const alertStyles = {
    critical: {
      bg: 'bg-status-critical/10',
      border: 'border-status-critical/30',
      icon: AlertTriangle,
      iconColor: 'text-status-critical',
      badge: 'bg-status-critical/20 text-status-critical',
    },
    warning: {
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/30',
      icon: AlertCircle,
      iconColor: 'text-status-warning',
      badge: 'bg-status-warning/20 text-status-warning',
    },
    info: {
      bg: 'bg-status-info/10',
      border: 'border-status-info/30',
      icon: Info,
      iconColor: 'text-status-info',
      badge: 'bg-status-info/20 text-status-info',
    },
  }

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Priority Alerts</h3>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const styles = alertStyles[alert.type]
          const Icon = styles.icon

          const handleAction = () => {
            if (alert.type === 'critical') {
              toast.error(alert.title, {
                description: 'Opening budget scenario modeler...',
                action: { label: 'Go', onClick: () => window.location.href = '/budget' },
              })
            } else if (alert.type === 'warning') {
              toast.warning(alert.title, {
                description: 'Opening grants pipeline...',
                action: { label: 'Go', onClick: () => window.location.href = '/grants' },
              })
            } else {
              toast.info(alert.title, {
                description: 'Opening lead details...',
                action: { label: 'Go', onClick: () => window.location.href = '/leads' },
              })
            }
          }

          return (
            <div
              key={alert.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex gap-3 hover-card-effect cursor-pointer`}
              onClick={handleAction}
            >
              <Icon className={styles.iconColor} size={20} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground text-sm">{alert.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}>
                    {alert.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                {alert.action && (
                  <button
                    className="mt-2 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    {alert.action}
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
