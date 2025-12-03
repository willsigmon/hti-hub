'use client'

import { useState } from 'react'
import {
  Zap, Play, Pause, CheckCircle2, AlertCircle, Clock, ArrowRight,
  RefreshCw, Settings, ExternalLink, Plus, MoreHorizontal, Activity,
  Mail, Users, Database, FileText, Bell, Calendar, Package
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Workflow {
  id: string
  name: string
  description: string
  trigger: string
  lastRun: string
  nextRun?: string
  status: 'Active' | 'Paused' | 'Error'
  successRate: number
  executions24h: number
  category: 'Donor' | 'Inventory' | 'Grants' | 'Operations' | 'Communications'
  icon: React.ElementType
}

const workflows: Workflow[] = [
  {
    id: '1',
    name: 'New Donor Onboarding',
    description: 'Sends welcome email, creates Knack record, notifies team on Slack, and schedules thank-you call.',
    trigger: 'New donor in system',
    lastRun: '2 mins ago',
    status: 'Active',
    successRate: 98,
    executions24h: 12,
    category: 'Donor',
    icon: Users,
  },
  {
    id: '2',
    name: 'Laptop Intake Process',
    description: 'Generates QR codes, assigns inventory numbers, updates Knack, and notifies Ron for processing.',
    trigger: 'Bulk donation received',
    lastRun: '1 hour ago',
    status: 'Active',
    successRate: 100,
    executions24h: 5,
    category: 'Inventory',
    icon: Package,
  },
  {
    id: '3',
    name: 'Grant Deadline Alert',
    description: 'Checks upcoming deadlines daily, sends reminder emails to Deirdre 30, 14, and 7 days before.',
    trigger: 'Daily at 9am',
    lastRun: 'Today 9:00 AM',
    nextRun: 'Tomorrow 9:00 AM',
    status: 'Active',
    successRate: 100,
    executions24h: 1,
    category: 'Grants',
    icon: FileText,
  },
  {
    id: '4',
    name: 'Donation Receipt Generator',
    description: 'Creates tax-deductible receipt PDFs, emails to donor, and logs in Knack.',
    trigger: 'Donation recorded',
    lastRun: '30 mins ago',
    status: 'Active',
    successRate: 95,
    executions24h: 8,
    category: 'Donor',
    icon: Mail,
  },
  {
    id: '5',
    name: 'Weekly Metrics Report',
    description: 'Compiles KPIs from all systems, generates summary, and emails to leadership team.',
    trigger: 'Every Monday 8am',
    lastRun: '3 days ago',
    nextRun: 'Monday 8:00 AM',
    status: 'Active',
    successRate: 100,
    executions24h: 0,
    category: 'Operations',
    icon: Activity,
  },
  {
    id: '6',
    name: 'Device Distribution Tracker',
    description: 'Updates inventory status when devices are distributed, notifies partners, logs recipient info.',
    trigger: 'Distribution event',
    lastRun: '2 days ago',
    status: 'Paused',
    successRate: 92,
    executions24h: 0,
    category: 'Inventory',
    icon: Database,
  },
  {
    id: '7',
    name: 'Event Reminder System',
    description: 'Sends reminder emails to registered attendees 1 week, 1 day, and 1 hour before events.',
    trigger: 'Scheduled',
    lastRun: 'Yesterday',
    status: 'Active',
    successRate: 100,
    executions24h: 3,
    category: 'Communications',
    icon: Calendar,
  },
  {
    id: '8',
    name: 'Knack Sync Backup',
    description: 'Backs up Knack database to Google Drive nightly. Maintains 30-day rolling backup.',
    trigger: 'Daily at 2am',
    lastRun: 'Today 2:00 AM',
    status: 'Error',
    successRate: 88,
    executions24h: 1,
    category: 'Operations',
    icon: Database,
  },
]

export default function Automations() {
  const [workflowList, setWorkflowList] = useState<Workflow[]>(workflows)
  const [triggering, setTriggering] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const stats = {
    active: workflowList.filter(w => w.status === 'Active').length,
    executions24h: workflowList.reduce((sum, w) => sum + w.executions24h, 0),
    errors: workflowList.filter(w => w.status === 'Error').length,
    avgSuccess: Math.round(workflowList.reduce((sum, w) => sum + w.successRate, 0) / workflowList.length),
  }

  const handleTrigger = async (workflow: Workflow) => {
    if (workflow.status !== 'Active') {
      toast.error('Cannot trigger paused or errored workflow')
      return
    }

    setTriggering(workflow.id)
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast.success(`Workflow triggered!`, {
      description: `"${workflow.name}" executed successfully`
    })

    setWorkflowList(prev =>
      prev.map(w =>
        w.id === workflow.id
          ? { ...w, lastRun: 'Just now', executions24h: w.executions24h + 1 }
          : w
      )
    )

    setTriggering(null)
  }

  const handleToggleStatus = (workflow: Workflow) => {
    const newStatus = workflow.status === 'Active' ? 'Paused' : 'Active'
    setWorkflowList(prev =>
      prev.map(w =>
        w.id === workflow.id ? { ...w, status: newStatus } : w
      )
    )
    toast.success(`Workflow ${newStatus.toLowerCase()}`, {
      description: workflow.name
    })
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'Error': return 'bg-red-500/10 text-red-400 border-red-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Donor': return 'text-pink-400'
      case 'Inventory': return 'text-blue-400'
      case 'Grants': return 'text-purple-400'
      case 'Operations': return 'text-yellow-400'
      case 'Communications': return 'text-green-400'
      default: return 'text-muted-foreground'
    }
  }

  const filteredWorkflows = categoryFilter === 'all'
    ? workflowList
    : workflowList.filter(w => w.category === categoryFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Automation Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Control your n8n workflows and monitor system health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-input hover:bg-white/5">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open n8n
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-l-4 border-l-primary hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Workflows</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.active}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Zap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-green-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Executions (24h)</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.executions24h}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-blue-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Success Rate</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.avgSuccess}%</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`glass-panel border-l-4 hover-card-effect ${stats.errors > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Errors</p>
                <h3 className={`text-2xl font-bold mt-1 font-heading ${stats.errors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.errors}
                </h3>
              </div>
              <div className={`p-2 rounded-lg ${stats.errors > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'Donor', 'Inventory', 'Grants', 'Operations', 'Communications'].map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'default' : 'outline'}
            size="sm"
            className={categoryFilter === category ? 'bg-primary' : 'glass-input'}
            onClick={() => setCategoryFilter(category)}
          >
            {category === 'all' ? 'All Workflows' : category}
          </Button>
        ))}
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredWorkflows.map((workflow) => {
          const WorkflowIcon = workflow.icon

          return (
            <Card key={workflow.id} className="glass-panel hover-card-effect group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${getCategoryColor(workflow.category)}`}>
                      <WorkflowIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {workflow.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getStatusStyle(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {workflow.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={workflow.status === 'Active' ? 'default' : 'outline'}
                    className={triggering === workflow.id ? 'animate-pulse' : ''}
                    onClick={() => handleTrigger(workflow)}
                    disabled={triggering === workflow.id || workflow.status !== 'Active'}
                  >
                    {triggering === workflow.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {workflow.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Last Run</p>
                    <p className="text-sm font-medium text-foreground">{workflow.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">24h Runs</p>
                    <p className="text-sm font-medium text-foreground">{workflow.executions24h}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Success</p>
                    <p className={`text-sm font-medium ${workflow.successRate >= 95 ? 'text-green-400' : workflow.successRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {workflow.successRate}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    {workflow.trigger}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => handleToggleStatus(workflow)}
                    >
                      {workflow.status === 'Active' ? (
                        <><Pause className="h-3 w-3 mr-1" /> Pause</>
                      ) : (
                        <><Play className="h-3 w-3 mr-1" /> Resume</>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
