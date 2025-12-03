import { sql } from '@vercel/postgres'

// Metrics
export async function getMetrics() {
  const { rows } = await sql`SELECT * FROM metrics ORDER BY id DESC LIMIT 1`
  return rows[0] || {
    budget_deficit: 85000,
    projected_revenue: 90000,
    gap_coverage: 100,
  }
}

export async function updateMetrics(data: {
  budget_deficit?: number
  projected_revenue?: number
  gap_coverage?: number
}) {
  const { rows } = await sql`
    UPDATE metrics
    SET budget_deficit = COALESCE(${data.budget_deficit}, budget_deficit),
        projected_revenue = COALESCE(${data.projected_revenue}, projected_revenue),
        gap_coverage = COALESCE(${data.gap_coverage}, gap_coverage),
        updated_at = NOW()
    WHERE id = 1
    RETURNING *
  `
  return rows[0]
}

// Team Members
export async function getTeamMembers() {
  const { rows } = await sql`SELECT * FROM team_members ORDER BY id`
  return rows
}

export async function getTeamMember(id: number) {
  const { rows } = await sql`SELECT * FROM team_members WHERE id = ${id}`
  return rows[0]
}

// Alerts
export async function getAlerts() {
  const { rows } = await sql`SELECT * FROM alerts ORDER BY created_at DESC`
  return rows
}

export async function createAlert(data: {
  title: string
  description: string
  type: 'critical' | 'warning' | 'info'
  link?: string
}) {
  const { rows } = await sql`
    INSERT INTO alerts (title, description, type, link)
    VALUES (${data.title}, ${data.description}, ${data.type}, ${data.link || null})
    RETURNING *
  `
  return rows[0]
}

export async function deleteAlert(id: number) {
  await sql`DELETE FROM alerts WHERE id = ${id}`
}

// Budget Scenarios
export async function saveBudgetScenario(data: {
  user_id: string
  scenario_type: string
  streams: object
  calculations: object
}) {
  const { rows } = await sql`
    INSERT INTO budget_scenarios (user_id, scenario_type, streams, calculations)
    VALUES (${data.user_id}, ${data.scenario_type}, ${JSON.stringify(data.streams)}, ${JSON.stringify(data.calculations)})
    RETURNING *
  `
  return rows[0]
}

export async function getBudgetScenarios(userId: string) {
  const { rows } = await sql`
    SELECT * FROM budget_scenarios
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return rows
}

// Initialize database schema
export async function initializeSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS metrics (
      id SERIAL PRIMARY KEY,
      budget_deficit INTEGER DEFAULT 85000,
      projected_revenue INTEGER DEFAULT 90000,
      gap_coverage INTEGER DEFAULT 100,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      initials TEXT,
      role TEXT,
      status TEXT DEFAULT 'active',
      system_prompt TEXT
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS alerts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT CHECK (type IN ('critical', 'warning', 'info')),
      link TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS budget_scenarios (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      scenario_type TEXT,
      streams JSONB,
      calculations JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  return { success: true }
}
