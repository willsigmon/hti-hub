'use client'

import { useState } from 'react'
import { Bot, MessageSquare, X } from 'lucide-react'
import ChatInterface from './ChatInterface'

interface TeamMember {
  id: string
  name: string
  initials: string
  role: string
  status: 'active' | 'away' | 'offline'
}

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Will Sigmon', initials: 'WS', role: 'Director of Business Development', status: 'active' },
  { id: '2', name: 'Mark Williams', initials: 'MW', role: 'Executive Director & Digital Literacy Lead', status: 'active' },
  { id: '3', name: 'Deirdre Greene', initials: 'DG', role: 'Grant Writer', status: 'active' },
  { id: '4', name: 'Ron Taylor', initials: 'RT', role: 'Operations Manager', status: 'away' },
]

export default function TeamHub() {
  const [selectedMember, setSelectedMember] = useState<TeamMember>(teamMembers[0])
  const [isChatOpen, setIsChatOpen] = useState(false)

  const statusColors = {
    active: 'bg-status-success',
    away: 'bg-status-warning',
    offline: 'bg-muted-foreground',
  }

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Team AI Hub</h3>
      <p className="text-sm text-muted-foreground mb-4">Select a team member to start strategizing</p>

      <div className="space-y-2 mb-6">
        {teamMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => {
              setSelectedMember(member)
              setIsChatOpen(false)
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              selectedMember.id === member.id
                ? 'bg-primary/20 border border-primary/50 shadow-lg'
                : 'hover:bg-secondary border border-transparent'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-foreground font-semibold text-sm border border-border">
                {member.initials}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${statusColors[member.status]}`}
              />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* AI Assistant Section */}
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-glow">
              <Bot size={16} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-foreground text-sm font-medium">{selectedMember.name}</p>
              <p className="text-muted-foreground text-xs">AI Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isChatOpen ? <X size={18} /> : <MessageSquare size={18} />}
          </button>
        </div>

        {isChatOpen ? (
          <ChatInterface memberName={selectedMember.name} memberRole={selectedMember.role} />
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-3">
              Hey! I'm {selectedMember.name.split(' ')[0]}'s AI twin. I can help you with{' '}
              {selectedMember.role.toLowerCase().includes('business')
                ? 'partnership strategies, donor outreach ideas, or our 2026 fundraising goals'
                : selectedMember.role.toLowerCase().includes('grant')
                ? 'grant writing, deadline tracking, and application strategies'
                : selectedMember.role.toLowerCase().includes('operations')
                ? 'equipment inventory, logistics, and operational efficiency'
                : 'program coordination, digital literacy initiatives, and community outreach'}
              . What's on your mind?
            </p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border-glow"
            >
              <MessageSquare size={16} />
              Start Chat
            </button>
          </>
        )}
      </div>
    </div>
  )
}
