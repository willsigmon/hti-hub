import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
}: MetricCardProps) {
  const variantStyles = {
    default: 'glass-panel',
    success: 'glass-panel border-status-success/30',
    warning: 'glass-panel border-status-warning/30',
    danger: 'glass-panel border-status-critical/30',
  }

  const valueStyles = {
    default: 'text-foreground',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-critical',
  }

  const trendStyles = {
    up: 'text-status-success',
    down: 'text-status-critical',
    neutral: 'text-muted-foreground',
  }

  return (
    <div className={`rounded-xl p-6 hover-card-effect ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${valueStyles[variant]}`}>{value}</p>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          {trend && trendValue && (
            <p className={`mt-2 text-sm font-medium ${trendStyles[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Icon className="text-primary" size={24} />
          </div>
        )}
      </div>
    </div>
  )
}
