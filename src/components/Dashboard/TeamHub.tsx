import { useState } from 'react'
import { Bot } from 'lucide-react'

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

  const statusColors = {
    active: 'bg-green-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-400',
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-lg font-semibold text-hti-navy mb-4">Team AI Hub</h3>
      <p className="text-sm text-gray-500 mb-4">Select a team member to start strategizing</p>

      <div className="space-y-2 mb-6">
        {teamMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              selectedMember.id === member.id
                ? 'bg-hti-orange/10 border border-hti-orange'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-hti-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {member.initials}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
              />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* AI Assistant Preview */}
      <div className="bg-hti-navy-dark rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-hti-orange rounded-full flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{selectedMember.name}</p>
            <p className="text-gray-400 text-xs">AI Assistant</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm">
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
      </div>
    </div>
  )
}
