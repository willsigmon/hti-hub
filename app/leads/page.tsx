'use client'

import { useState } from 'react'
import {
  Search, Globe, Building2, Sparkles, ArrowRight, CheckCircle2,
  Target, TrendingUp, Users, Laptop, DollarSign, ExternalLink,
  Zap, Brain, RefreshCw, Plus, Filter, MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Lead {
  id: string
  company: string
  website: string
  industry: string
  fitScore: number
  status: 'New' | 'Researching' | 'Qualified' | 'Contacted' | 'Converted'
  summary: string
  equipmentPotential: 'High' | 'Medium' | 'Low'
  sponsorPotential: 'High' | 'Medium' | 'Low'
  contactName?: string
  contactEmail?: string
  lastActivity: string
  source: 'AI Discovery' | 'Referral' | 'Event' | 'Website' | 'Manual'
}

const initialLeads: Lead[] = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    website: 'techcorp.example.com',
    industry: 'Information Technology',
    fitScore: 92,
    status: 'Qualified',
    summary: 'Large local IT firm with CSR program focused on digital equity. Upgrading 300+ workstations in Q1 2026. Perfect timing for bulk equipment donation partnership.',
    equipmentPotential: 'High',
    sponsorPotential: 'Medium',
    contactName: 'Jennifer Walsh',
    contactEmail: 'jwalsh@techcorp.example.com',
    lastActivity: '2 hours ago',
    source: 'AI Discovery',
  },
  {
    id: '2',
    company: 'Triangle Health Systems',
    website: 'trianglehealth.example.com',
    industry: 'Healthcare',
    fitScore: 88,
    status: 'Contacted',
    summary: 'Regional healthcare provider with 15 clinics. Replacing laptops across all locations due to HIPAA compliance updates. Strong community engagement history.',
    equipmentPotential: 'High',
    sponsorPotential: 'High',
    contactName: 'Michael Rivera',
    contactEmail: 'mrivera@trianglehealth.example.com',
    lastActivity: '1 day ago',
    source: 'Referral',
  },
  {
    id: '3',
    company: 'First Carolina Bank',
    website: 'firstcarolina.example.com',
    industry: 'Financial Services',
    fitScore: 85,
    status: 'New',
    summary: 'Community bank with 25 branches in NC. Active CRA program and history of nonprofit support. IT refresh cycle every 3 years.',
    equipmentPotential: 'Medium',
    sponsorPotential: 'High',
    lastActivity: 'Just now',
    source: 'AI Discovery',
  },
  {
    id: '4',
    company: 'NC State University',
    website: 'ncsu.edu',
    industry: 'Higher Education',
    fitScore: 78,
    status: 'Researching',
    summary: 'Major research university with thousands of computers. Annual equipment surplus auctions. Potential for ongoing partnership.',
    equipmentPotential: 'High',
    sponsorPotential: 'Low',
    lastActivity: '3 days ago',
    source: 'Event',
  },
  {
    id: '5',
    company: 'Raleigh Law Group',
    website: 'raleighlawgroup.example.com',
    industry: 'Legal Services',
    fitScore: 72,
    status: 'New',
    summary: 'Mid-size law firm with pro bono digital divide focus. Replacing office equipment and interested in volunteer opportunities.',
    equipmentPotential: 'Low',
    sponsorPotential: 'Medium',
    lastActivity: '5 hours ago',
    source: 'Website',
  },
]

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [urlInput, setUrlInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const stats = {
    total: leads.length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    highFit: leads.filter(l => l.fitScore >= 80).length,
    converted: leads.filter(l => l.status === 'Converted').length,
  }

  const handleAnalyze = async () => {
    if (!urlInput) return
    setAnalyzing(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2500))

      const domain = urlInput.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]
      const companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)

      const newLead: Lead = {
        id: Date.now().toString(),
        company: companyName,
        website: domain,
        industry: 'Technology',
        fitScore: Math.floor(Math.random() * 25) + 70,
        status: 'New',
        summary: `AI-analyzed prospect from ${domain}. Initial assessment suggests potential for equipment donation partnership. Recommend further research into their CSR initiatives and IT refresh cycles.`,
        equipmentPotential: Math.random() > 0.5 ? 'High' : 'Medium',
        sponsorPotential: Math.random() > 0.6 ? 'Medium' : 'Low',
        lastActivity: 'Just now',
        source: 'AI Discovery',
      }

      setLeads([newLead, ...leads])
      setUrlInput('')
      toast.success('Lead analyzed and added!', {
        description: `${companyName} has a ${newLead.fitScore}% fit score`
      })
    } catch (error) {
      toast.error('Failed to analyze lead')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/10 border-green-500/30'
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    if (score >= 50) return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    return 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Researching': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'Qualified': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'Converted': return 'bg-primary/10 text-primary border-primary/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-green-400'
      case 'Medium': return 'text-yellow-400'
      case 'Low': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  const filteredLeads = statusFilter === 'all'
    ? leads
    : leads.filter(l => l.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Lead Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered prospecting for equipment donors and sponsors
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-l-4 border-l-blue-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Leads</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.total}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-green-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Qualified</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.qualified}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-yellow-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">High Fit (80%+)</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.highFit}</h3>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-primary hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Converted</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.converted}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analyzer */}
      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            Prospect Analyzer
          </CardTitle>
          <CardDescription>
            Enter a company website to calculate their HTI Fit Score™ using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. https://www.cisco.com"
                className="pl-9 glass-input"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !urlInput}
              className="bg-primary hover:bg-primary/90 min-w-[140px]"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'New', 'Researching', 'Qualified', 'Contacted', 'Converted'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            className={statusFilter === status ? 'bg-primary' : 'glass-input'}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all' ? 'All Leads' : status}
          </Button>
        ))}
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="glass-panel hover-card-effect group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {lead.company}
                    </h3>
                    <a
                      href={`https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      {lead.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-lg border text-lg font-bold ${getScoreColor(lead.fitScore)}`}>
                  {lead.fitScore}%
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {lead.summary}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Laptop className="h-3 w-3" />
                    Equipment Potential
                  </div>
                  <p className={`font-bold ${getPotentialColor(lead.equipmentPotential)}`}>
                    {lead.equipmentPotential}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    Sponsor Potential
                  </div>
                  <p className={`font-bold ${getPotentialColor(lead.sponsorPotential)}`}>
                    {lead.sponsorPotential}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {lead.source === 'AI Discovery' && <Zap className="h-3 w-3 text-primary" />}
                    {lead.source}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{lead.lastActivity}</span>
                  <Button variant="ghost" size="sm" className="hover:text-primary">
                    View <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">No leads found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
