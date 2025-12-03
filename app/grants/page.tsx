'use client'

import { useState } from 'react'
import {
  Plus, Calendar, DollarSign, MoreHorizontal, FileText, Clock,
  Target, AlertTriangle, CheckCircle, ArrowRight, ExternalLink,
  Sparkles, TrendingUp, Users, Building2
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Grant {
  id: string
  title: string
  funder: string
  funderType: 'Government' | 'Foundation' | 'Corporate'
  amount: number
  deadline: string
  status: 'Prospect' | 'Drafting' | 'Submitted' | 'Under Review' | 'Awarded' | 'Declined'
  probability: number
  assignee: string
  description: string
  requirements?: string[]
  matchRequired?: boolean
  notes?: string
}

const initialGrants: Grant[] = [
  {
    id: '1',
    title: 'NC Digital Equity Act Grant',
    funder: 'NC Dept of Information Technology',
    funderType: 'Government',
    amount: 45000,
    deadline: '2025-01-15',
    status: 'Drafting',
    probability: 75,
    assignee: 'Deirdre Greene',
    description: 'Federal pass-through funding for digital literacy and device access programs.',
    requirements: ['501c3 status', 'Serve underserved populations', 'Match 10%'],
    matchRequired: true,
  },
  {
    id: '2',
    title: 'Community Impact Grant',
    funder: 'Triangle Community Foundation',
    funderType: 'Foundation',
    amount: 15000,
    deadline: '2025-02-28',
    status: 'Prospect',
    probability: 50,
    assignee: 'Deirdre Greene',
    description: 'General operating support for nonprofits serving the Triangle region.',
  },
  {
    id: '3',
    title: 'Tech for Good Program',
    funder: 'Cisco Foundation',
    funderType: 'Corporate',
    amount: 25000,
    deadline: '2024-12-31',
    status: 'Submitted',
    probability: 65,
    assignee: 'Will Sigmon',
    description: 'Equipment and program support for digital inclusion initiatives.',
    notes: 'Submitted Nov 15, awaiting response'
  },
  {
    id: '4',
    title: 'Local Hero Award',
    funder: 'Bank of America',
    funderType: 'Corporate',
    amount: 5000,
    deadline: '2024-10-15',
    status: 'Awarded',
    probability: 100,
    assignee: 'Mark Williams',
    description: 'Recognition grant for community impact.',
    notes: 'Received! Funds deposited Nov 1'
  },
  {
    id: '5',
    title: 'Digital Literacy Expansion',
    funder: 'NC State Library',
    funderType: 'Government',
    amount: 30000,
    deadline: '2025-03-01',
    status: 'Prospect',
    probability: 40,
    assignee: 'Deirdre Greene',
    description: 'LSTA funding for library partnership programs.',
  },
  {
    id: '6',
    title: 'Equipment Refurbishment Program',
    funder: 'Dell Foundation',
    funderType: 'Corporate',
    amount: 20000,
    deadline: '2025-01-31',
    status: 'Under Review',
    probability: 55,
    assignee: 'Ron Taylor',
    description: 'Support for refurbishment operations and volunteer training.',
    notes: 'Site visit scheduled Dec 10'
  },
]

const columns = ['Prospect', 'Drafting', 'Submitted', 'Under Review', 'Awarded']

export default function Grants() {
  const [grants, setGrants] = useState<Grant[]>(initialGrants)
  const [draggedGrant, setDraggedGrant] = useState<Grant | null>(null)

  const stats = {
    totalPipeline: grants.filter(g => g.status !== 'Awarded' && g.status !== 'Declined').reduce((sum, g) => sum + g.amount, 0),
    awarded: grants.filter(g => g.status === 'Awarded').reduce((sum, g) => sum + g.amount, 0),
    pending: grants.filter(g => ['Submitted', 'Under Review'].includes(g.status)).length,
    upcoming: grants.filter(g => {
      const deadline = new Date(g.deadline)
      const now = new Date()
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 30 && daysUntil > 0 && !['Awarded', 'Declined'].includes(g.status)
    }).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Prospect': return 'bg-slate-500/10 border-slate-500/30'
      case 'Drafting': return 'bg-blue-500/10 border-blue-500/30'
      case 'Submitted': return 'bg-purple-500/10 border-purple-500/30'
      case 'Under Review': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'Awarded': return 'bg-green-500/10 border-green-500/30'
      case 'Declined': return 'bg-red-500/10 border-red-500/30'
      default: return 'bg-white/5 border-white/10'
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-400'
    if (prob >= 50) return 'text-yellow-400'
    if (prob >= 30) return 'text-orange-400'
    return 'text-red-400'
  }

  const getFunderIcon = (type: string) => {
    switch (type) {
      case 'Government': return Building2
      case 'Foundation': return Users
      case 'Corporate': return Target
      default: return FileText
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleDragStart = (grant: Grant) => {
    setDraggedGrant(grant)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: string) => {
    if (draggedGrant) {
      setGrants(prev =>
        prev.map(g =>
          g.id === draggedGrant.id
            ? { ...g, status: status as Grant['status'] }
            : g
        )
      )
      toast.success(`Moved "${draggedGrant.title}" to ${status}`)
      setDraggedGrant(null)
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Grant Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">
            Track applications, deadlines, and funding opportunities
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          New Grant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-l-4 border-l-blue-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pipeline Value</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">${(stats.totalPipeline / 1000).toFixed(0)}k</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-green-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Awarded YTD</p>
                <h3 className="text-2xl font-bold mt-1 font-heading text-green-400">${(stats.awarded / 1000).toFixed(0)}k</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-purple-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Decision</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.pending}</h3>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-orange-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due in 30 Days</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.upcoming}</h3>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0">
        {columns.map((column) => {
          const columnGrants = grants.filter(g => g.status === column)
          const columnTotal = columnGrants.reduce((sum, g) => sum + g.amount, 0)

          return (
            <div
              key={column}
              className="flex flex-col bg-white/5 rounded-xl border border-white/5 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column)}
            >
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{column}</h3>
                  <Badge variant="secondary" className="bg-white/10 text-xs">
                    {columnGrants.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">${(columnTotal / 1000).toFixed(0)}k total</p>
              </div>

              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {columnGrants.map(grant => {
                  const FunderIcon = getFunderIcon(grant.funderType)
                  const daysUntil = getDaysUntilDeadline(grant.deadline)
                  const isUrgent = daysUntil <= 14 && daysUntil > 0

                  return (
                    <Card
                      key={grant.id}
                      className={`glass-panel hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group ${getStatusColor(grant.status)}`}
                      draggable
                      onDragStart={() => handleDragStart(grant)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground flex items-center gap-1">
                            <FunderIcon className="h-3 w-3" />
                            {grant.funder.split(' ').slice(0, 2).join(' ')}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-2 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <div>
                          <h4 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {grant.title}
                          </h4>
                          <div className="flex items-center gap-1 text-primary font-bold mt-2 text-lg">
                            <DollarSign className="h-4 w-4" />
                            {grant.amount.toLocaleString()}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {grant.description}
                        </p>

                        {grant.matchRequired && (
                          <div className="flex items-center gap-1 text-xs text-yellow-400">
                            <AlertTriangle className="h-3 w-3" />
                            Match required
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                          <div className={`flex items-center gap-1 ${isUrgent ? 'text-orange-400' : 'text-muted-foreground'}`}>
                            <Calendar className="h-3 w-3" />
                            {isUrgent && daysUntil > 0 ? `${daysUntil}d left` : new Date(grant.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <span className={`font-medium ${getProbabilityColor(grant.probability)}`}>
                            {grant.probability}%
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Assigned: {grant.assignee.split(' ')[0]}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {columnGrants.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                    Drop grants here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
