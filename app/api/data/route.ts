import { NextResponse } from 'next/server'
import { getMetrics, getTeamMembers, getAlerts } from '@/lib/db'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    const [metrics, team, alerts] = await Promise.all([
      getMetrics(),
      getTeamMembers(),
      getAlerts(),
    ])

    return NextResponse.json({
      metrics,
      team,
      alerts,
    })
  } catch (error) {
    // Return fallback data if database is not connected
    return NextResponse.json({
      metrics: {
        budget_deficit: 85000,
        projected_revenue: 90000,
        gap_coverage: 100,
      },
      team: [
        { id: 1, name: 'Will Sigmon', initials: 'WS', role: 'Director of Business Development', status: 'active' },
        { id: 2, name: 'Mark Williams', initials: 'MW', role: 'Executive Director & Digital Literacy Lead', status: 'active' },
        { id: 3, name: 'Deirdre Greene', initials: 'DG', role: 'Grant Writer', status: 'active' },
        { id: 4, name: 'Ron Taylor', initials: 'RT', role: 'Operations Manager', status: 'away' },
      ],
      alerts: [
        { id: 1, title: 'Budget Gap Critical', description: '$85k deficit projected for Q1 2026. Immediate action required on Equipment Sales.', type: 'critical', link: '/budget-gap' },
        { id: 2, title: 'Grant Deadline', description: 'NC Digital Equity Grant due in 3 days. Narrative draft pending review.', type: 'warning', link: '/grants' },
        { id: 3, title: 'New Lead Detected', description: 'Cisco Systems CSR program matches HTI profile (92% Fit Score).', type: 'info', link: '/leads' },
      ],
      _fallback: true,
      _error: error instanceof Error ? error.message : 'Database not connected',
    })
  }
}
