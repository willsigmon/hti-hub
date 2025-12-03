'use client'

import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin,
  Plus, Users, Video, Phone, ExternalLink, MoreHorizontal, Bell,
  CheckCircle, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: 'Meeting' | 'Event' | 'Deadline' | 'Call' | 'Internal'
  location: string
  description?: string
  attendees?: string[]
  isVirtual?: boolean
  priority: 'high' | 'medium' | 'low'
}

const events: Event[] = [
  {
    id: '1',
    title: 'Board Meeting',
    date: '2024-12-03',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    type: 'Meeting',
    location: 'Zoom',
    description: 'Q4 review and 2026 budget planning',
    attendees: ['Mark Williams', 'Board Members'],
    isVirtual: true,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Grant Review w/ Deirdre',
    date: '2024-12-03',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    type: 'Internal',
    location: 'Office',
    description: 'Review NC Digital Equity Act draft',
    attendees: ['Deirdre Greene', 'Will Sigmon'],
    isVirtual: false,
    priority: 'high',
  },
  {
    id: '3',
    title: 'Laptop Distribution',
    date: '2024-12-03',
    startTime: '3:30 PM',
    endTime: '5:00 PM',
    type: 'Event',
    location: 'Durham Community Center',
    description: '25 laptops to be distributed to qualifying families',
    attendees: ['Ron Taylor', 'Volunteers'],
    isVirtual: false,
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Cisco Foundation Call',
    date: '2024-12-04',
    startTime: '11:00 AM',
    endTime: '11:30 AM',
    type: 'Call',
    location: 'Phone',
    description: 'Follow-up on Tech for Good grant submission',
    attendees: ['Will Sigmon'],
    isVirtual: true,
    priority: 'high',
  },
  {
    id: '5',
    title: 'Tech for Good Grant Deadline',
    date: '2024-12-31',
    startTime: '11:59 PM',
    endTime: '11:59 PM',
    type: 'Deadline',
    location: 'Online Submission',
    description: 'Final submission for Cisco Tech for Good Program',
    priority: 'high',
  },
  {
    id: '6',
    title: 'Weekly Team Standup',
    date: '2024-12-05',
    startTime: '9:00 AM',
    endTime: '9:30 AM',
    type: 'Internal',
    location: 'Google Meet',
    attendees: ['All Staff'],
    isVirtual: true,
    priority: 'low',
  },
  {
    id: '7',
    title: 'Partner Appreciation Dinner',
    date: '2024-12-15',
    startTime: '6:00 PM',
    endTime: '9:00 PM',
    type: 'Event',
    location: 'Piedmont Club, Durham',
    description: 'Year-end celebration with major donors and partners',
    attendees: ['All Staff', 'Partners'],
    isVirtual: false,
    priority: 'medium',
  },
]

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const getEventsForDate = (date: string) => {
    return events.filter(e => e.date === date)
  }

  const formatDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Meeting': return 'bg-blue-500'
      case 'Event': return 'bg-green-500'
      case 'Deadline': return 'bg-red-500'
      case 'Call': return 'bg-purple-500'
      case 'Internal': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Meeting': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Event': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Deadline': return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'Call': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'Internal': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const todayEvents = events.filter(e => e.date === formatDateString(today.getDate()))
  const upcomingDeadlines = events.filter(e => e.type === 'Deadline' && new Date(e.date) > today).slice(0, 3)

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            Unified view of HTI events and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="glass-input" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 glass-input rounded-md font-medium min-w-[160px] text-center">
            {months[currentMonth]} {currentYear}
          </div>
          <Button variant="outline" size="icon" className="glass-input" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="ml-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Calendar Grid */}
        <Card className="glass-panel lg:col-span-2 flex flex-col">
          <CardContent className="p-4 flex-1">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = formatDateString(day)
                const dayEvents = getEventsForDate(dateStr)
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                      aspect-square p-1 rounded-lg border transition-all text-left relative
                      ${isToday(day) ? 'border-primary bg-primary/10' : 'border-transparent hover:border-white/10 hover:bg-white/5'}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <span className={`text-sm font-medium ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className={`h-1 flex-1 rounded-full ${getTypeColor(event.type)}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4 overflow-y-auto">
          {/* Today's Agenda */}
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Today&apos;s Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No events today</p>
              ) : (
                todayEvents.map((event) => (
                  <div key={event.id} className="glass-panel p-3 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className={getTypeStyle(event.type)}>
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.startTime}</span>
                    </div>
                    <h4 className="font-bold text-foreground text-sm">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        {event.isVirtual ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const daysUntil = Math.ceil((new Date(deadline.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={deadline.id} className="glass-panel p-3 border-l-2 border-l-red-500">
                    <h4 className="font-bold text-foreground text-sm">{deadline.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{deadline.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-xs font-medium ${daysUntil <= 7 ? 'text-red-400' : daysUntil <= 14 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                        {daysUntil} days left
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-panel">
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start glass-input">
                <Video className="h-4 w-4 mr-2" />
                Schedule Zoom
              </Button>
              <Button variant="outline" className="w-full justify-start glass-input">
                <Users className="h-4 w-4 mr-2" />
                Team Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start glass-input">
                <Bell className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
