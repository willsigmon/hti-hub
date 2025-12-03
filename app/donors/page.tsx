'use client'

import { useState, useMemo } from 'react'
import {
  Search, Filter, Download, RefreshCw, Users, Heart, DollarSign, Star,
  Plus, Mail, Phone, Calendar, TrendingUp, Award, Gift, Sparkles,
  ArrowUpRight, MoreHorizontal, Building2, User
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Donor {
  id: string
  name: string
  email: string
  phone: string
  organization?: string
  type: 'Individual' | 'Corporate' | 'Foundation'
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'New'
  totalGiven: number
  lastGift: number
  lastGiftDate: string
  donorSince: string
  status: 'Active' | 'Lapsed' | 'New'
  recurring: boolean
  engagementScore: number
  notes?: string
}

const initialDonors: Donor[] = [
  { id: '1', name: 'Sarah Mitchell', email: 'sarah.m@techcorp.com', phone: '(919) 555-0123', organization: 'TechCorp Solutions', type: 'Corporate', tier: 'Platinum', totalGiven: 25000, lastGift: 10000, lastGiftDate: '2024-11-01', donorSince: '2021-03-15', status: 'Active', recurring: true, engagementScore: 95 },
  { id: '2', name: 'Michael Chen', email: 'mchen@trianglevc.com', phone: '(919) 555-0234', organization: 'Triangle Ventures', type: 'Corporate', tier: 'Gold', totalGiven: 15000, lastGift: 5000, lastGiftDate: '2024-10-15', donorSince: '2022-01-20', status: 'Active', recurring: true, engagementScore: 88 },
  { id: '3', name: 'Jessica Williams', email: 'jwilliams@gmail.com', phone: '(984) 555-0345', type: 'Individual', tier: 'Gold', totalGiven: 8500, lastGift: 2500, lastGiftDate: '2024-09-20', donorSince: '2020-06-10', status: 'Active', recurring: false, engagementScore: 75 },
  { id: '4', name: 'Robert Johnson', email: 'rjohnson@localbank.com', phone: '(919) 555-0456', organization: 'Local Community Bank', type: 'Corporate', tier: 'Silver', totalGiven: 5000, lastGift: 2500, lastGiftDate: '2024-08-01', donorSince: '2023-02-14', status: 'Active', recurring: false, engagementScore: 65 },
  { id: '5', name: 'Amanda Foster', email: 'afoster@yahoo.com', phone: '(984) 555-0567', type: 'Individual', tier: 'Silver', totalGiven: 3200, lastGift: 500, lastGiftDate: '2024-11-10', donorSince: '2022-09-05', status: 'Active', recurring: true, engagementScore: 82 },
  { id: '6', name: 'David Park', email: 'dpark@parkfoundation.org', phone: '(919) 555-0678', organization: 'Park Family Foundation', type: 'Foundation', tier: 'Platinum', totalGiven: 50000, lastGift: 25000, lastGiftDate: '2024-06-15', donorSince: '2019-11-20', status: 'Active', recurring: false, engagementScore: 70 },
  { id: '7', name: 'Lisa Thompson', email: 'lthompson@outlook.com', phone: '(984) 555-0789', type: 'Individual', tier: 'Bronze', totalGiven: 750, lastGift: 250, lastGiftDate: '2024-07-20', donorSince: '2024-01-10', status: 'Active', recurring: true, engagementScore: 60 },
  { id: '8', name: 'James Wilson', email: 'jwilson@durhamtech.edu', phone: '(919) 555-0890', organization: 'Durham Tech', type: 'Corporate', tier: 'Bronze', totalGiven: 1000, lastGift: 500, lastGiftDate: '2024-03-15', donorSince: '2023-08-22', status: 'Lapsed', recurring: false, engagementScore: 35 },
  { id: '9', name: 'Emily Rodriguez', email: 'erodriguez@gmail.com', phone: '(984) 555-0901', type: 'Individual', tier: 'New', totalGiven: 100, lastGift: 100, lastGiftDate: '2024-11-20', donorSince: '2024-11-20', status: 'New', recurring: false, engagementScore: 50, notes: 'Attended Nov laptop distribution event' },
  { id: '10', name: 'Christopher Lee', email: 'clee@leefamilyfdn.org', phone: '(919) 555-1012', organization: 'Lee Family Foundation', type: 'Foundation', tier: 'Gold', totalGiven: 20000, lastGift: 10000, lastGiftDate: '2024-04-01', donorSince: '2021-07-15', status: 'Active', recurring: false, engagementScore: 68 },
]

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>(initialDonors)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch =
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donor.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesTier = tierFilter === 'all' || donor.tier === tierFilter

      return matchesSearch && matchesTier
    })
  }, [donors, searchTerm, tierFilter])

  const stats = useMemo(() => {
    const totalContributions = donors.reduce((sum, d) => sum + d.totalGiven, 0)
    const recurringDonors = donors.filter(d => d.recurring).length
    const monthlyRecurring = donors.filter(d => d.recurring).reduce((sum, d) => sum + d.lastGift, 0) / 12
    const avgDonation = totalContributions / donors.length

    return {
      totalDonors: donors.length,
      totalContributions,
      recurringDonors,
      monthlyRecurring,
      avgDonation,
      newThisMonth: donors.filter(d => d.status === 'New').length,
    }
  }, [donors])

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
      case 'Gold': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30'
      case 'Silver': return 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 text-slate-300 border-slate-500/30'
      case 'Bronze': return 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 text-orange-300 border-orange-600/30'
      case 'New': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const handleSync = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Donor database synced', { description: `${donors.length} donors loaded` })
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Donor Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Relationship management and giving analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-input hover:bg-white/5" onClick={handleSync}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button variant="outline" className="glass-input hover:bg-white/5">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Donor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-l-4 border-l-purple-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Donors</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.totalDonors}</h3>
                <p className="text-xs text-green-400 mt-1">+{stats.newThisMonth} new this month</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-green-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Contributions</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">${(stats.totalContributions / 1000).toFixed(0)}k</h3>
                <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +18% YTD
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-pink-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recurring Donors</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.recurringDonors}</h3>
                <p className="text-xs text-muted-foreground mt-1">${stats.monthlyRecurring.toFixed(0)}/mo avg</p>
              </div>
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                <Heart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-yellow-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Donation</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">${stats.avgDonation.toFixed(0)}</h3>
                <p className="text-xs text-muted-foreground mt-1">per donor lifetime</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search donors, organizations, emails..."
            className="pl-9 glass-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'Platinum', 'Gold', 'Silver', 'Bronze', 'New'].map((tier) => (
            <Button
              key={tier}
              variant={tierFilter === tier ? 'default' : 'outline'}
              size="sm"
              className={tierFilter === tier ? 'bg-primary' : 'glass-input'}
              onClick={() => setTierFilter(tier)}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </Button>
          ))}
        </div>
      </div>

      {/* Donor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.map((donor) => (
          <Card key={donor.id} className="glass-panel hover-card-effect group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                    {donor.type === 'Individual' ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Building2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {donor.name}
                    </h3>
                    {donor.organization && (
                      <p className="text-xs text-muted-foreground">{donor.organization}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={`${getTierStyle(donor.tier)} text-xs`}>
                  <Star className="h-3 w-3 mr-1" />
                  {donor.tier}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Given</p>
                  <p className="text-lg font-bold text-green-400">${donor.totalGiven.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Gift</p>
                  <p className="text-lg font-bold text-foreground">${donor.lastGift.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Donor since {new Date(donor.donorSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                <div className="flex items-center gap-1">
                  <Sparkles className={`h-3 w-3 ${getEngagementColor(donor.engagementScore)}`} />
                  <span className={getEngagementColor(donor.engagementScore)}>{donor.engagementScore}% engaged</span>
                </div>
              </div>

              {donor.recurring && (
                <div className="mb-4 px-3 py-2 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span className="text-xs text-pink-300">Monthly recurring donor</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <Button variant="ghost" size="sm" className="flex-1 h-9 hover:bg-primary/10 hover:text-primary">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 h-9 hover:bg-primary/10 hover:text-primary">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">No donors found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
