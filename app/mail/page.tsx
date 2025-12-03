'use client'

import { useState } from 'react'
import {
  Search, Mail as MailIcon, Star, Archive, Trash2, PenSquare, Send,
  Inbox, Clock, AlertCircle, CheckCircle, MoreHorizontal, Paperclip,
  Reply, Forward, Tag, Filter, RefreshCw, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Email {
  id: string
  from: string
  fromEmail: string
  to: string
  subject: string
  preview: string
  body: string
  time: string
  date: string
  unread: boolean
  starred: boolean
  hasAttachment: boolean
  labels: string[]
  priority: 'high' | 'normal' | 'low'
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash'
}

const initialEmails: Email[] = [
  {
    id: '1',
    from: 'Deirdre Greene',
    fromEmail: 'deirdre@hti.org',
    to: 'will@hti.org',
    subject: 'NC Digital Equity Grant - Final Draft Ready for Review',
    preview: 'Hi Will, I\'ve completed the final draft of the NC Digital Equity Act grant application. Please review the budget section...',
    body: 'Hi Will,\n\nI\'ve completed the final draft of the NC Digital Equity Act grant application. Please review the budget section and the program narrative. I\'ve incorporated all of Mark\'s feedback from yesterday.\n\nKey changes:\n- Updated budget to reflect the 10% match requirement\n- Added more specific metrics for device distribution\n- Included testimonials from last year\'s participants\n\nLet me know if you need any changes by EOD Friday.\n\nBest,\nDeirdre',
    time: '10:30 AM',
    date: '2024-12-03',
    unread: true,
    starred: true,
    hasAttachment: true,
    labels: ['Grants', 'Urgent'],
    priority: 'high',
    folder: 'inbox',
  },
  {
    id: '2',
    from: 'Mark Williams',
    fromEmail: 'mark@hti.org',
    to: 'team@hti.org',
    subject: 'Board Meeting Agenda - December 10th',
    preview: 'Team, please review the attached agenda for next Tuesday\'s board meeting. I\'ll need everyone\'s updates by Friday...',
    body: 'Team,\n\nPlease review the attached agenda for next Tuesday\'s board meeting. I\'ll need everyone\'s updates by Friday.\n\nAgenda items:\n1. Q4 Financial Review\n2. 2026 Budget Proposal\n3. Equipment Distribution Update\n4. Grant Pipeline Status\n5. Strategic Planning Discussion\n\nLet me know if you have any items to add.\n\nMark',
    time: 'Yesterday',
    date: '2024-12-02',
    unread: false,
    starred: false,
    hasAttachment: true,
    labels: ['Internal'],
    priority: 'normal',
    folder: 'inbox',
  },
  {
    id: '3',
    from: 'Ron Taylor',
    fromEmail: 'ron@hti.org',
    to: 'will@hti.org',
    subject: 'Inventory Update - 50 Dell Latitudes Received',
    preview: 'Good news! We just received a shipment of 50 Dell Latitude E7470 laptops from TechCorp. I\'ve started the intake process...',
    body: 'Good news!\n\nWe just received a shipment of 50 Dell Latitude E7470 laptops from TechCorp. I\'ve started the intake process and assigned inventory numbers HTI-2024-050 through HTI-2024-100.\n\nSpecs:\n- Dell Latitude E7470\n- Intel Core i5-6300U\n- 8GB RAM (most have 16GB)\n- 256GB SSD\n\nMost are in excellent condition. About 5 need battery replacements.\n\nI should have them all ready for distribution by next Friday.\n\nRon',
    time: 'Dec 1',
    date: '2024-12-01',
    unread: false,
    starred: false,
    hasAttachment: false,
    labels: ['Inventory'],
    priority: 'normal',
    folder: 'inbox',
  },
  {
    id: '4',
    from: 'Jennifer Walsh',
    fromEmail: 'jwalsh@techcorp.example.com',
    to: 'will@hti.org',
    subject: 'Re: Equipment Donation Partnership',
    preview: 'Thank you for the detailed proposal. I\'ve shared it with our CSR committee and they\'re very interested...',
    body: 'Hi Will,\n\nThank you for the detailed proposal. I\'ve shared it with our CSR committee and they\'re very interested in establishing an ongoing partnership.\n\nWe have approximately 300 workstations scheduled for refresh in Q1 2026. Would HTI be able to handle a donation of this size?\n\nAlso, would you be available for a call next week to discuss logistics?\n\nBest regards,\nJennifer Walsh\nCSR Director, TechCorp Solutions',
    time: 'Nov 30',
    date: '2024-11-30',
    unread: true,
    starred: true,
    hasAttachment: false,
    labels: ['Leads', 'Important'],
    priority: 'high',
    folder: 'inbox',
  },
  {
    id: '5',
    from: 'Cisco Foundation',
    fromEmail: 'grants@ciscofoundation.org',
    to: 'grants@hti.org',
    subject: 'Tech for Good Grant - Application Received',
    preview: 'Thank you for submitting your application to the Cisco Tech for Good Program. Your application #TFG-2024-1847 has been received...',
    body: 'Dear HubZone Technology Initiative,\n\nThank you for submitting your application to the Cisco Tech for Good Program.\n\nApplication Details:\n- Application ID: TFG-2024-1847\n- Amount Requested: $25,000\n- Program: Digital Inclusion Initiative\n\nYour application is currently under review. You can expect to hear back from us within 4-6 weeks.\n\nIf you have any questions, please contact grants@ciscofoundation.org.\n\nBest regards,\nCisco Foundation Grants Team',
    time: 'Nov 28',
    date: '2024-11-28',
    unread: false,
    starred: false,
    hasAttachment: false,
    labels: ['Grants'],
    priority: 'normal',
    folder: 'inbox',
  },
]

const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 4 },
  { id: 'starred', label: 'Starred', icon: Star, count: 2 },
  { id: 'sent', label: 'Sent', icon: Send, count: 0 },
  { id: 'drafts', label: 'Drafts', icon: PenSquare, count: 1 },
  { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
  { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
]

export default function Mail() {
  const [emails, setEmails] = useState<Email[]>(initialEmails)
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEmails = emails.filter(email => {
    if (selectedFolder === 'starred') return email.starred
    if (selectedFolder !== 'inbox') return email.folder === selectedFolder
    return email.folder === 'inbox'
  }).filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStarEmail = (id: string) => {
    setEmails(prev =>
      prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e)
    )
  }

  const handleMarkRead = (id: string) => {
    setEmails(prev =>
      prev.map(e => e.id === id ? { ...e, unread: false } : e)
    )
  }

  const handleArchive = (id: string) => {
    setEmails(prev =>
      prev.map(e => e.id === id ? { ...e, folder: 'archive' as const } : e)
    )
    toast.success('Email archived')
    if (selectedEmail?.id === id) setSelectedEmail(null)
  }

  const handleDelete = (id: string) => {
    setEmails(prev =>
      prev.map(e => e.id === id ? { ...e, folder: 'trash' as const } : e)
    )
    toast.success('Email moved to trash')
    if (selectedEmail?.id === id) setSelectedEmail(null)
  }

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Grants': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'Urgent': return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'Important': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'Internal': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Inventory': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'Leads': return 'bg-primary/10 text-primary border-primary/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Inbox
          </h1>
          <p className="text-muted-foreground mt-1">
            Secure communication hub for HTI operations
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <PenSquare className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Main Content */}
      <Card className="glass-panel flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r border-white/5 p-4 space-y-1 hidden md:block">
          {folders.map((folder) => {
            const FolderIcon = folder.icon
            const isActive = selectedFolder === folder.id

            return (
              <button
                key={folder.id}
                onClick={() => {
                  setSelectedFolder(folder.id)
                  setSelectedEmail(null)
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}
                `}
              >
                <div className="flex items-center gap-3">
                  <FolderIcon className="h-4 w-4" />
                  {folder.label}
                </div>
                {folder.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-white/10'}`}>
                    {folder.count}
                  </span>
                )}
              </button>
            )
          })}

          <div className="pt-4 mt-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground font-medium px-3 mb-2">Labels</p>
            {['Grants', 'Leads', 'Inventory', 'Internal'].map((label) => (
              <button
                key={label}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${label === 'Grants' ? 'bg-purple-500' : label === 'Leads' ? 'bg-primary' : label === 'Inventory' ? 'bg-green-500' : 'bg-blue-500'}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div className={`flex-1 flex flex-col min-w-0 border-r border-white/5 ${selectedEmail ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                className="pl-9 glass-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MailIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>No emails found</p>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => {
                    setSelectedEmail(email)
                    handleMarkRead(email.id)
                  }}
                  className={`
                    w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors
                    ${email.unread ? 'bg-white/[0.02]' : ''}
                    ${selectedEmail?.id === email.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStarEmail(email.id)
                      }}
                      className={`mt-1 ${email.starred ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}
                    >
                      <Star className={`h-4 w-4 ${email.starred ? 'fill-current' : ''}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm truncate ${email.unread ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                          {email.from}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{email.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm truncate ${email.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {email.subject}
                        </span>
                        {email.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{email.preview}</p>
                      {email.labels.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {email.labels.map((label) => (
                            <Badge key={label} variant="outline" className={`text-[10px] h-5 ${getLabelColor(label)}`}>
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Email Detail */}
        {selectedEmail && (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSelectedEmail(null)}>
                  Back
                </Button>
                <Button variant="ghost" size="sm">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleArchive(selectedEmail.id)}>
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(selectedEmail.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-4">{selectedEmail.subject}</h2>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {selectedEmail.from.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedEmail.from}</p>
                      <p className="text-xs text-muted-foreground">{selectedEmail.fromEmail}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedEmail.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {selectedEmail.time}
                  </span>
                </div>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                {selectedEmail.body.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-foreground mb-4">{paragraph}</p>
                ))}
              </div>

              {selectedEmail.hasAttachment && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Attachment</p>
                      <p className="text-xs text-muted-foreground">Click to download</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
