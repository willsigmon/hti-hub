import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initializeSchema } from '@/lib/db'

export async function POST() {
  try {
    // Initialize schema first
    await initializeSchema()

    // Check if data already exists
    const { rows: existingMetrics } = await sql`SELECT COUNT(*) as count FROM metrics`

    if (Number(existingMetrics[0].count) === 0) {
      // Insert initial metrics
      await sql`
        INSERT INTO metrics (budget_deficit, projected_revenue, gap_coverage)
        VALUES (85000, 90000, 100)
      `
    }

    // Check if team members exist
    const { rows: existingTeam } = await sql`SELECT COUNT(*) as count FROM team_members`

    if (Number(existingTeam[0].count) === 0) {
      // Insert team members
      await sql`
        INSERT INTO team_members (name, initials, role, status) VALUES
        ('Will Sigmon', 'WS', 'Director of Business Development', 'active'),
        ('Mark Williams', 'MW', 'Executive Director & Digital Literacy Lead', 'active'),
        ('Deirdre Greene', 'DG', 'Grant Writer', 'active'),
        ('Ron Taylor', 'RT', 'Operations Manager', 'away')
      `
    }

    // Check if alerts exist
    const { rows: existingAlerts } = await sql`SELECT COUNT(*) as count FROM alerts`

    if (Number(existingAlerts[0].count) === 0) {
      // Insert sample alerts
      await sql`
        INSERT INTO alerts (title, description, type, link) VALUES
        ('Budget Gap Critical', '$85k deficit projected for Q1 2026. Immediate action required on Equipment Sales.', 'critical', '/budget-gap'),
        ('Grant Deadline', 'NC Digital Equity Grant due in 3 days. Narrative draft pending review.', 'warning', '/grants'),
        ('New Lead Detected', 'Cisco Systems CSR program matches HTI profile (92% Fit Score).', 'info', '/leads')
      `
    }

    // Fetch all data to return
    const { rows: metrics } = await sql`SELECT * FROM metrics LIMIT 1`
    const { rows: team_members } = await sql`SELECT * FROM team_members`
    const { rows: alerts } = await sql`SELECT * FROM alerts ORDER BY created_at DESC`

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        metrics: metrics[0],
        team_members,
        alerts,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure POSTGRES_URL is set in Vercel environment variables',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Try to fetch current data
    const { rows: metrics } = await sql`SELECT * FROM metrics LIMIT 1`
    const { rows: team_members } = await sql`SELECT * FROM team_members`
    const { rows: alerts } = await sql`SELECT * FROM alerts ORDER BY created_at DESC`

    return NextResponse.json({
      status: 'connected',
      data: {
        metrics: metrics[0] || null,
        team_members,
        alerts,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'not_connected',
      message: 'POST to this endpoint to initialize and seed database',
      error: error instanceof Error ? error.message : 'Database not configured',
      hint: 'Create a Postgres database at https://vercel.com/dashboard/stores',
    })
  }
}
