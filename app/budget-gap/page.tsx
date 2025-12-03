'use client'

import { useState, useMemo } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { toast } from 'sonner'
import { useHubby } from '@/contexts/HubbyContext'

interface RevenueStream {
  id: string
  name: string
  min: number
  max: number
  current: number
  color: string
  description: string
}

const initialStreams: RevenueStream[] = [
  {
    id: 'equipment',
    name: 'Equipment Sales',
    min: 0,
    max: 60000,
    current: 40000,
    color: '#FF6B00',
    description: 'Refurbished device sales - most fruitful opportunity',
  },
  {
    id: 'grants',
    name: 'Grants',
    min: 0,
    max: 50000,
    current: 25000,
    color: '#38BDF8',
    description: 'NC Digital Equity Grant + foundation opportunities',
  },
  {
    id: 'donations',
    name: 'Donations & Events',
    min: 0,
    max: 30000,
    current: 15000,
    color: '#22C55E',
    description: 'Year-end campaigns + donor appreciation events',
  },
  {
    id: 'services',
    name: 'Fee-for-Service',
    min: 0,
    max: 20000,
    current: 5000,
    color: '#A855F7',
    description: 'Digital literacy training + consulting',
  },
]

const BUDGET_DEFICIT = 85000
const CONSERVATIVE_MULTIPLIER = 0.75
const OPTIMISTIC_MULTIPLIER = 1.15

export default function BudgetGap() {
  const [streams, setStreams] = useState<RevenueStream[]>(initialStreams)
  const [scenario, setScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic')
  const { triggerReaction } = useHubby()

  const multiplier =
    scenario === 'conservative'
      ? CONSERVATIVE_MULTIPLIER
      : scenario === 'optimistic'
      ? OPTIMISTIC_MULTIPLIER
      : 1

  const calculations = useMemo(() => {
    const totalProjected = streams.reduce((sum, s) => sum + s.current * multiplier, 0)
    const gap = BUDGET_DEFICIT - totalProjected
    const gapCovered = Math.min(100, (totalProjected / BUDGET_DEFICIT) * 100)
    const surplus = gap < 0 ? Math.abs(gap) : 0

    return {
      totalProjected: Math.round(totalProjected),
      gap: Math.round(gap),
      gapCovered: Math.round(gapCovered),
      surplus: Math.round(surplus),
      isDeficitClosed: gap <= 0,
    }
  }, [streams, multiplier])

  const handleSliderChange = (id: string, value: number) => {
    setStreams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, current: value } : s))
    )
  }

  const handleReset = () => {
    setStreams(initialStreams)
    toast.info('Reset to default projections')
    triggerReaction('idle')
  }

  const handleSaveScenario = () => {
    const scenarioData = {
      scenario,
      streams: streams.map((s) => ({ id: s.id, value: s.current })),
      calculations,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('hti-budget-scenario', JSON.stringify(scenarioData))
    toast.success('Scenario saved locally', {
      description: `${scenario} projection: $${calculations.totalProjected.toLocaleString()} revenue`,
    })
    triggerReaction('success')
  }

  const chartData = streams.map((s) => ({
    name: s.name.split(' ')[0],
    projected: Math.round(s.current * multiplier),
    potential: s.max,
    color: s.color,
  }))

  const pieData = streams.map((s) => ({
    name: s.name,
    value: Math.round(s.current * multiplier),
    color: s.color,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Budget Gap Scenario Modeler</h1>
          <p className="text-muted-foreground mt-1">
            Model revenue scenarios to close the 2026 ${BUDGET_DEFICIT.toLocaleString()} deficit
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
          >
            Reset
          </button>
          <button
            onClick={handleSaveScenario}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg border-glow"
          >
            Save Scenario
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TrendingDown size={16} className="text-status-critical" />
            Budget Deficit
          </div>
          <p className="text-2xl font-bold text-status-critical">
            ${BUDGET_DEFICIT.toLocaleString()}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TrendingUp size={16} className="text-status-success" />
            Projected Revenue
          </div>
          <p className="text-2xl font-bold text-status-success">
            ${calculations.totalProjected.toLocaleString()}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            {calculations.isDeficitClosed ? (
              <CheckCircle size={16} className="text-status-success" />
            ) : (
              <AlertTriangle size={16} className="text-status-warning" />
            )}
            {calculations.isDeficitClosed ? 'Surplus' : 'Remaining Gap'}
          </div>
          <p
            className={`text-2xl font-bold ${
              calculations.isDeficitClosed ? 'text-status-success' : 'text-status-warning'
            }`}
          >
            ${calculations.isDeficitClosed
              ? calculations.surplus.toLocaleString()
              : calculations.gap.toLocaleString()}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Target size={16} className="text-primary" />
            Gap Coverage
          </div>
          <p className="text-2xl font-bold text-foreground">
            {calculations.gapCovered}%
          </p>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                calculations.gapCovered >= 100
                  ? 'bg-status-success'
                  : calculations.gapCovered >= 75
                  ? 'bg-primary'
                  : 'bg-status-warning'
              }`}
              style={{ width: `${Math.min(100, calculations.gapCovered)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scenario Toggle */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Scenario Type</span>
        </div>
        <div className="flex gap-2">
          {(['conservative', 'realistic', 'optimistic'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                scenario === s
                  ? 'bg-primary text-primary-foreground shadow-lg border-glow'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="block text-xs opacity-75">
                {s === 'conservative' ? '75%' : s === 'optimistic' ? '115%' : '100%'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Sliders */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Revenue Streams</h2>
          {streams.map((stream) => (
            <div key={stream.id} className="glass-panel rounded-xl p-4 hover-card-effect">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stream.color }}
                  />
                  <span className="font-medium text-foreground">{stream.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-muted-foreground" />
                  <span className="font-bold text-foreground">
                    {Math.round(stream.current * multiplier).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{stream.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-12">$0</span>
                <input
                  type="range"
                  min={stream.min}
                  max={stream.max}
                  value={stream.current}
                  onChange={(e) => handleSliderChange(stream.id, Number(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs text-muted-foreground w-16 text-right">
                  ${(stream.max / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Visualization</h2>

          {/* Bar Chart */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Projected vs Potential
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} stroke="#64748B" fontSize={12} />
                <YAxis type="category" dataKey="name" width={60} fontSize={12} stroke="#64748B" />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="projected" fill="#FF6B00" radius={4} name="Projected" />
                <Bar dataKey="potential" fill="rgba(255,255,255,0.1)" radius={4} name="Potential" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Revenue Mix
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {!calculations.isDeficitClosed && (
        <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-status-warning mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-status-warning">
                ${calculations.gap.toLocaleString()} more needed to close the gap
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Consider increasing Equipment Sales (highest potential) or pursuing
                additional grant opportunities. The NC Digital Equity Grant could add
                $25k+ to your projections.
              </p>
            </div>
          </div>
        </div>
      )}

      {calculations.isDeficitClosed && (
        <div className="bg-status-success/10 border border-status-success/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-status-success mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-status-success">
                Budget deficit closed with ${calculations.surplus.toLocaleString()} surplus
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Great projections! Consider allocating surplus to reserve funds or
                program expansion. Save this scenario to track progress.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
