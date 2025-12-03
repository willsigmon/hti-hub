'use client'

import { DollarSign, TrendingUp, Percent, BarChart3 } from 'lucide-react'
import MetricCard from '@/components/Dashboard/MetricCard'
import TeamHub from '@/components/Dashboard/TeamHub'
import PriorityAlerts from '@/components/Dashboard/PriorityAlerts'

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div data-tour="metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="2026 Budget Deficit"
          value="$85,000"
          subtitle="Projected shortfall"
          icon={DollarSign}
          variant="danger"
        />
        <MetricCard
          title="Proposed Revenue"
          value="+$90,000"
          subtitle="Conservative projection"
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Projected Surplus"
          value="+$5,000"
          subtitle="After closing gap"
          icon={BarChart3}
        />
        <MetricCard
          title="Gap Coverage"
          value="100%"
          icon={Percent}
          trend="up"
          trendValue="On track"
          variant="success"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="YTD Revenue"
          value="$0"
          trend="up"
          trendValue="+12% vs Target"
        />
        <MetricCard
          title="Active Donors"
          value="0"
          trend="up"
          trendValue="+5 New this month"
        />
        <MetricCard
          title="Presentations"
          value="0"
          subtitle="On Track (20 Target)"
        />
        <MetricCard
          title="Devices Deployed"
          value="0"
          subtitle="Inventory Low"
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Hub - spans 2 columns */}
        <div data-tour="team-hub" className="lg:col-span-2">
          <TeamHub />
        </div>

        {/* Priority Alerts */}
        <div data-tour="alerts">
          <PriorityAlerts />
        </div>
      </div>
    </div>
  )
}
