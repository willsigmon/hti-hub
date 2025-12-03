import { NextResponse } from 'next/server'

// This endpoint will seed initial data to Vercel Postgres
// Currently returns mock data structure for reference

export async function POST() {
  // When Vercel Postgres is set up, this will insert:
  // - Initial metrics
  // - Team members
  // - Sample alerts

  const seedData = {
    metrics: {
      budget_deficit: 85000,
      projected_revenue: 85000,
      gap_coverage: 100,
    },
    team_members: [
      { name: 'Will Sigmon', initials: 'WS', role: 'Director of Business Development' },
      { name: 'Mark Williams', initials: 'MW', role: 'Executive Director' },
      { name: 'Deirdre Greene', initials: 'DG', role: 'Grant Writer' },
      { name: 'Ron Taylor', initials: 'RT', role: 'Operations Manager' },
    ],
    alerts: [
      { title: 'Budget Gap Critical', type: 'critical', description: '$85k deficit projected for Q1 2026' },
      { title: 'Grant Deadline', type: 'warning', description: 'NC Digital Equity Grant due in 3 days' },
      { title: 'New Lead Detected', type: 'info', description: 'Cisco Systems CSR program matches HTI' },
    ],
  }

  // TODO: When Vercel Postgres is connected:
  // await sql`INSERT INTO metrics ...`
  // await sql`INSERT INTO team_members ...`
  // await sql`INSERT INTO alerts ...`

  return NextResponse.json({
    success: true,
    message: 'Seed data structure ready. Connect Vercel Postgres to persist.',
    data: seedData,
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed data',
    status: 'ready',
  })
}
