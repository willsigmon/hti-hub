'use client'

import { useState, useEffect } from 'react'
import {
  Search, Filter, Plus, MoreHorizontal, Phone, Mail, Calendar,
  CheckCircle2, Clock, AlertCircle, ArrowRight, Building2, User,
  Users, DollarSign, Target, TrendingUp, Activity, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface Deal {
  id: number
  name: string
  company: string
  value: number
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost'
  probability: number
  owner: string
  lastActivity: string
  type: 'Donation' | 'Grant' | 'Sponsorship' | 'Equipment'
}

interface Contact {
  id: number
  name: string
  role: string
  company: string
  email: string
  phone: string
  status: 'Active' | 'Warm' | 'Cold' | 'Customer'
  lastContact: string
}

interface Activity {
  id: number
  type: 'email' | 'call' | 'meeting' | 'note'
  title: string
  contact: string
  date: string
  user: string
  description?: string
}

const initialDeals: Deal[] = [
  { id: 1, name: 'Tech for Good Grant 2026', company: 'Cisco Foundation', value: 25000, stage: 'Proposal', probability: 65, owner: 'Deirdre Greene', lastActivity: '2 days ago', type: 'Grant' },
  { id: 2, name: 'Q1 Laptop Donation', company: 'TechCorp Solutions', value: 15000, stage: 'Negotiation', probability: 80, owner: 'Will Sigmon', lastActivity: '5 hours ago', type: 'Equipment' },
  { id: 3, name: 'Community Sponsorship', company: 'First Carolina Bank', value: 5000, stage: 'Closed Won', probability: 100, owner: 'Mark Williams', lastActivity: '1 week ago', type: 'Sponsorship' },
  { id: 4, name: 'Digital Literacy Expansion', company: 'NC State Library', value: 30000, stage: 'Discovery', probability: 30, owner: 'Deirdre Greene', lastActivity: '1 day ago', type: 'Grant' },
  { id: 5, name: 'Annual Donation', company: 'Triangle Health Systems', value: 10000, stage: 'Proposal', probability: 55, owner: 'Will Sigmon', lastActivity: '3 days ago', type: 'Donation' },
  { id: 6, name: 'Workstation Refresh', company: 'Durham Tech', value: 8000, stage: 'Discovery', probability: 25, owner: 'Ron Taylor', lastActivity: '6 hours ago', type: 'Equipment' },
]

const initialContacts: Contact[] = [
  { id: 1, name: 'Sarah Johnson', role: 'CSR Director', company: 'Cisco', email: 'sarah.j@cisco.com', phone: '(555) 123-4567', status: 'Active', lastContact: '2 days ago' },
  { id: 2, name: 'Mike Chen', role: 'Regional Manager', company: 'TechCorp', email: 'mchen@techcorp.com', phone: '(555) 987-6543', status: 'Active', lastContact: '5 hours ago' },
  { id: 3, name: 'Jessica Davis', role: 'Community Lead', company: 'First Carolina', email: 'jdavis@firstcarolina.com', phone: '(555) 456-7890', status: 'Customer', lastContact: '1 week ago' },
  { id: 4, name: 'Robert Kim', role: 'Foundation Director', company: 'NC State Library', email: 'rkim@ncstatelibrary.gov', phone: '(555) 321-0987', status: 'Warm', lastContact: '1 day ago' },
  { id: 5, name: 'Amanda Foster', role: 'Partnerships Manager', company: 'Triangle Health', email: 'afoster@trianglehealth.com', phone: '(555) 654-3210', status: 'Active', lastContact: '3 days ago' },
]

const initialActivities: Activity[] = [
  { id: 1, type: 'email', title: 'Sent grant proposal draft', contact: 'Sarah Johnson', date: 'Today, 10:30 AM', user: 'Deirdre Greene', description: 'Sent updated budget and program narrative' },
  { id: 2, type: 'call', title: 'Discovery call with Mike', contact: 'Mike Chen', date: 'Yesterday, 2:00 PM', user: 'Will Sigmon', description: 'Discussed Q1 equipment refresh timeline' },
  { id: 3, type: 'meeting', title: 'Quarterly Review', contact: 'Jessica Davis', date: 'Dec 1, 11:00 AM', user: 'Mark Williams', description: 'Reviewed partnership impact and 2026 plans' },
  { id: 4, type: 'note', title: 'Added contact info', contact: 'Robert Kim', date: 'Nov 30, 4:15 PM', user: 'Deirdre Greene', description: 'Met at NC Nonprofit Conference' },
  { id: 5, type: 'email', title: 'Follow-up on donation', contact: 'Amanda Foster', date: 'Nov 29, 9:00 AM', user: 'Will Sigmon' },
]

export default function CRM() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [searchTerm, setSearchTerm] = useState('')

  const stats = {
    totalPipeline: deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).reduce((sum, d) => sum + d.value, 0),
    activeDeals: deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length,
    wonValue: deals.filter(d => d.stage === 'Closed Won').reduce((sum, d) => sum + d.value, 0),
    winRate: Math.round((deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100),
  }

  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: Date.now(),
      name: 'New Opportunity',
      company: 'Prospect',
      value: 0,
      stage: 'Discovery',
      probability: 10,
      owner: 'Will Sigmon',
      lastActivity: 'Just now',
      type: 'Donation',
    }
    setDeals([newDeal, ...deals])
    toast.success('New deal created')
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery': return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
      case 'Proposal': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Negotiation': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'Closed Won': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Closed Lost': return 'bg-red-500/10 text-red-400 border-red-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Warm': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'Cold': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Customer': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-400'
    if (prob >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'call': return Phone
      case 'meeting': return Users
      case 'note': return MessageSquare
      default: return Activity
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            CRM & Relationships
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage donors, grants, and strategic partnerships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-input hover:bg-white/5">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleAddDeal} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel hover-card-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">${stats.totalPipeline.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-400 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel hover-card-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground mt-1">4 closing this month</p>
          </CardContent>
        </Card>
        <Card className="glass-panel hover-card-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Won This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-green-400">${stats.wonValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-400 font-medium">{stats.winRate}%</span> win rate
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel hover-card-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{contacts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+3 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Contacts
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Activities
          </TabsTrigger>
        </TabsList>

        {/* Pipeline View */}
        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Discovery', 'Proposal', 'Negotiation', 'Closed Won'].map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage)
              const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

              return (
                <div key={stage} className="flex flex-col bg-white/5 rounded-xl border border-white/5 min-h-[500px]">
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{stage}</h3>
                      <Badge variant="outline" className="bg-white/10 text-xs">
                        {stageDeals.length}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">${stageValue.toLocaleString()}</p>
                  </div>

                  <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {stageDeals.map((deal) => (
                      <Card key={deal.id} className="glass-panel hover:border-primary/50 transition-all cursor-pointer group">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                              {deal.type}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                              {deal.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{deal.company}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Value</span>
                              <span className="font-mono font-medium text-green-400">${deal.value.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Probability</span>
                              <span className={`font-medium ${getProbabilityColor(deal.probability)}`}>
                                {deal.probability}%
                              </span>
                            </div>
                            <Progress
                              value={deal.probability}
                              className={cn(
                                "h-1 bg-white/5",
                                deal.probability >= 70 ? "[&>div]:bg-green-500" :
                                deal.probability >= 40 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
                              )}
                            />
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t border-white/5">
                            <Clock className="h-3 w-3" />
                            {deal.lastActivity}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* Contacts View */}
        <TabsContent value="contacts">
          <Card className="glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Contacts</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-9 glass-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts
                .filter(c =>
                  c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.company.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {contact.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{contact.role} at {contact.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </div>
                    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </div>
                    <Badge variant="outline" className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities View */}
        <TabsContent value="activities">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
                {activities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="relative pl-8">
                      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        With <span className="text-primary">{activity.contact}</span> • {activity.user}
                      </p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                      )}
                      <Badge variant="secondary" className="text-[10px] h-5">
                        <ActivityIcon className="h-3 w-3 mr-1" />
                        {activity.type.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
