'use client'

import { useState, useEffect } from 'react'
import {
  Save, Database, Key, AlertCircle, Bell, Shield, Palette, User,
  Building2, Zap, Globe, CheckCircle, ExternalLink, RefreshCw,
  Moon, Sun, Monitor, Mail, Smartphone
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected' | 'error'
  icon: React.ElementType
  lastSync?: string
}

const integrations: Integration[] = [
  { id: 'knack', name: 'Knack Database', description: 'Master device inventory and donor records', status: 'connected', icon: Database, lastSync: '5 mins ago' },
  { id: 'n8n', name: 'n8n Automations', description: 'Workflow automation engine', status: 'connected', icon: Zap, lastSync: '2 mins ago' },
  { id: 'google', name: 'Google Workspace', description: 'Calendar, Drive, and Gmail integration', status: 'connected', icon: Globe, lastSync: '1 hour ago' },
  { id: 'slack', name: 'Slack', description: 'Team notifications and alerts', status: 'disconnected', icon: Mail },
  { id: 'gemini', name: 'Google Gemini AI', description: 'Powers the AI assistant and analytics', status: 'connected', icon: Zap, lastSync: 'Active' },
]

export default function Settings() {
  const [settings, setSettings] = useState({
    knackApiKey: '',
    knackAppId: '',
    geminiApiKey: '',
    n8nWebhookUrl: '',
    notifyEmail: true,
    notifySlack: false,
    notifyPush: true,
    darkMode: 'system' as 'light' | 'dark' | 'system',
    compactMode: false,
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('hti_settings')
    if (saved) {
      setSettings(prev => ({ ...prev, ...JSON.parse(saved) }))
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('hti_settings', JSON.stringify(settings))
    toast.success('Settings saved successfully')
    setSaving(false)
  }

  const handleTestConnection = (integration: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Testing ${integration} connection...`,
        success: `${integration} connection successful!`,
        error: 'Connection failed',
      }
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'disconnected': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure integrations, preferences, and system options
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          disabled={saving}
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="organization" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Organization
          </TabsTrigger>
        </TabsList>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          {/* Connected Services */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Connected Services
              </CardTitle>
              <CardDescription>
                Manage your connected integrations and data sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => {
                const IntegrationIcon = integration.icon
                return (
                  <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <IntegrationIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {integration.lastSync && (
                        <span className="text-xs text-muted-foreground">
                          Last sync: {integration.lastSync}
                        </span>
                      )}
                      <Badge variant="outline" className={getStatusColor(integration.status)}>
                        {integration.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {integration.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-input"
                        onClick={() => handleTestConnection(integration.name)}
                      >
                        {integration.status === 'connected' ? 'Test' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API keys for external services (stored locally)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Knack Application ID</label>
                  <Input
                    type="text"
                    placeholder="e.g., 5f1a2b3c4d5e6f..."
                    className="glass-input"
                    value={settings.knackAppId}
                    onChange={(e) => setSettings(prev => ({ ...prev, knackAppId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Knack API Key</label>
                  <Input
                    type="password"
                    placeholder="Enter your Knack API key..."
                    className="glass-input"
                    value={settings.knackApiKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, knackApiKey: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">n8n Webhook URL</label>
                  <Input
                    type="url"
                    placeholder="https://n8n.example.com/webhook/..."
                    className="glass-input"
                    value={settings.n8nWebhookUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, n8nWebhookUrl: e.target.value }))}
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">Security Notice</p>
                  <p className="text-yellow-300/80 mt-1">
                    API keys are stored locally in your browser. Never share these keys or commit them to version control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: 'email', icon: Mail, label: 'Email Notifications', description: 'Daily digest and important alerts', key: 'notifyEmail' as const },
                { id: 'slack', icon: Zap, label: 'Slack Notifications', description: 'Real-time alerts in #hti-alerts channel', key: 'notifySlack' as const },
                { id: 'push', icon: Smartphone, label: 'Push Notifications', description: 'Browser notifications for urgent items', key: 'notifyPush' as const },
              ].map((item) => {
                const ItemIcon = item.icon
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <ItemIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{item.label}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
              <CardDescription>Configure which events trigger notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  'Grant deadline reminders (7, 14, 30 days)',
                  'New donor registrations',
                  'Equipment inventory low alerts',
                  'Weekly metrics summary',
                  'System health warnings',
                ].map((alert, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary" />
                    <span className="text-sm text-foreground">{alert}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Color Mode</label>
                <div className="flex gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' },
                  ].map((mode) => {
                    const ModeIcon = mode.icon
                    return (
                      <button
                        key={mode.value}
                        onClick={() => setSettings(prev => ({ ...prev, darkMode: mode.value as 'light' | 'dark' | 'system' }))}
                        className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                          settings.darkMode === mode.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                        }`}
                      >
                        <ModeIcon className="h-5 w-5" />
                        {mode.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <h4 className="font-medium text-foreground">Compact Mode</h4>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content density</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings.compactMode ? 'bg-primary' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.compactMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Organization Profile
              </CardTitle>
              <CardDescription>
                Manage your organization's information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Organization Name</label>
                  <Input
                    type="text"
                    defaultValue="HubZone Technology Initiative"
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tax ID (EIN)</label>
                  <Input
                    type="text"
                    defaultValue="XX-XXXXXXX"
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Primary Contact</label>
                  <Input
                    type="text"
                    defaultValue="Mark Williams"
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contact Email</label>
                  <Input
                    type="email"
                    defaultValue="info@hti.org"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mission Statement</label>
                <textarea
                  className="w-full h-24 px-3 py-2 rounded-lg glass-input resize-none"
                  defaultValue="Closing the digital divide by providing refurbished technology and digital literacy training to underserved communities in the Triangle region."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" className="glass-input">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <h4 className="font-medium text-foreground">Session Timeout</h4>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <select className="px-3 py-2 rounded-lg glass-input text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <h4 className="font-medium text-foreground">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Download all your organization data</p>
                </div>
                <Button variant="outline" className="glass-input">
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
