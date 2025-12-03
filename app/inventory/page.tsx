'use client'

import { useState, useMemo } from 'react'
import {
  Search, Filter, Download, RefreshCw, Laptop, Smartphone, Monitor, Tablet,
  Printer, HardDrive, Wrench, Package, Plus, QrCode, Trash2, Edit,
  CheckCircle, AlertTriangle, Clock, MoreHorizontal, ArrowUpDown,
  Cpu, Battery, Wifi
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Device {
  id: string
  inventoryNumber: string
  type: 'Laptop' | 'Desktop' | 'Tablet' | 'Phone' | 'Printer' | 'Other'
  brand: string
  model: string
  serialNumber: string
  status: 'Ready' | 'In Process' | 'Needs Repair' | 'Distributed' | 'Discarded'
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  dateAdded: string
  specs?: string
  assignedTo?: string
}

const initialDevices: Device[] = [
  { id: '1', inventoryNumber: 'HTI-2024-001', type: 'Laptop', brand: 'Dell', model: 'Latitude E7470', serialNumber: 'DL7470X1234', status: 'Ready', condition: 'Excellent', dateAdded: '2024-11-15', specs: 'i5-6300U, 8GB RAM, 256GB SSD' },
  { id: '2', inventoryNumber: 'HTI-2024-002', type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad T460', serialNumber: 'LN460Y5678', status: 'Ready', condition: 'Good', dateAdded: '2024-11-14', specs: 'i5-6200U, 8GB RAM, 256GB SSD' },
  { id: '3', inventoryNumber: 'HTI-2024-003', type: 'Desktop', brand: 'HP', model: 'ProDesk 600 G2', serialNumber: 'HP600Z9012', status: 'In Process', condition: 'Good', dateAdded: '2024-11-13', specs: 'i5-6500, 16GB RAM, 500GB HDD' },
  { id: '4', inventoryNumber: 'HTI-2024-004', type: 'Tablet', brand: 'Apple', model: 'iPad 7th Gen', serialNumber: 'APIP7A3456', status: 'Needs Repair', condition: 'Fair', dateAdded: '2024-11-12', specs: '32GB, Cracked screen' },
  { id: '5', inventoryNumber: 'HTI-2024-005', type: 'Phone', brand: 'Samsung', model: 'Galaxy S10', serialNumber: 'SGS10B7890', status: 'Ready', condition: 'Excellent', dateAdded: '2024-11-11', specs: '128GB, Unlocked' },
  { id: '6', inventoryNumber: 'HTI-2024-006', type: 'Laptop', brand: 'Dell', model: 'Latitude 5580', serialNumber: 'DL5580C1234', status: 'Distributed', condition: 'Good', dateAdded: '2024-11-10', assignedTo: 'Durham Library', specs: 'i7-7600U, 16GB RAM, 512GB SSD' },
  { id: '7', inventoryNumber: 'HTI-2024-007', type: 'Desktop', brand: 'Dell', model: 'OptiPlex 7050', serialNumber: 'DL7050D5678', status: 'Ready', condition: 'Excellent', dateAdded: '2024-11-09', specs: 'i7-7700, 32GB RAM, 1TB SSD' },
  { id: '8', inventoryNumber: 'HTI-2024-008', type: 'Printer', brand: 'HP', model: 'LaserJet Pro M404n', serialNumber: 'HPM404E9012', status: 'Ready', condition: 'Good', dateAdded: '2024-11-08' },
  { id: '9', inventoryNumber: 'HTI-2024-009', type: 'Laptop', brand: 'Apple', model: 'MacBook Pro 2017', serialNumber: 'APMBF3456', status: 'In Process', condition: 'Good', dateAdded: '2024-11-07', specs: 'i5, 8GB RAM, 256GB SSD' },
  { id: '10', inventoryNumber: 'HTI-2024-010', type: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab S6', serialNumber: 'SGTS6G7890', status: 'Ready', condition: 'Excellent', dateAdded: '2024-11-06', specs: '128GB, WiFi + LTE' },
  { id: '11', inventoryNumber: 'HTI-2024-011', type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', serialNumber: 'LNX1CH1234', status: 'Needs Repair', condition: 'Fair', dateAdded: '2024-11-05', specs: 'i7-8650U, 16GB RAM, Battery issue' },
  { id: '12', inventoryNumber: 'HTI-2024-012', type: 'Desktop', brand: 'Lenovo', model: 'ThinkCentre M920', serialNumber: 'LNM920I5678', status: 'Distributed', condition: 'Excellent', dateAdded: '2024-11-04', assignedTo: 'Raleigh Community Center', specs: 'i5-8500, 16GB RAM, 512GB SSD' },
]

const typeIcons: Record<string, React.ElementType> = {
  Laptop: Laptop,
  Desktop: Monitor,
  Tablet: Tablet,
  Phone: Smartphone,
  Printer: Printer,
  Other: HardDrive,
}

export default function Inventory() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set())

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch =
        device.inventoryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || device.status === statusFilter
      const matchesType = typeFilter === 'all' || device.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [devices, searchTerm, statusFilter, typeFilter])

  const stats = useMemo(() => ({
    total: devices.length,
    ready: devices.filter(d => d.status === 'Ready').length,
    inProcess: devices.filter(d => d.status === 'In Process').length,
    needsRepair: devices.filter(d => d.status === 'Needs Repair').length,
    distributed: devices.filter(d => d.status === 'Distributed').length,
  }), [devices])

  const handleSync = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Inventory synced with Knack database', {
      description: `${devices.length} devices loaded`
    })
    setLoading(false)
  }

  const handleExport = () => {
    const csv = [
      ['Inventory #', 'Type', 'Brand', 'Model', 'Serial', 'Status', 'Condition', 'Date Added'].join(','),
      ...filteredDevices.map(d => [d.inventoryNumber, d.type, d.brand, d.model, d.serialNumber, d.status, d.condition, d.dateAdded].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hti-inventory-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Inventory exported to CSV')
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'In Process': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Needs Repair': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'Distributed': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'Discarded': return 'bg-red-500/10 text-red-400 border-red-500/30'
      default: return 'bg-white/5 text-muted-foreground border-white/10'
    }
  }

  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'text-green-400'
      case 'Good': return 'text-blue-400'
      case 'Fair': return 'text-yellow-400'
      case 'Poor': return 'text-red-400'
      default: return 'text-muted-foreground'
    }
  }

  const toggleSelectDevice = (id: string) => {
    const newSelected = new Set(selectedDevices)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedDevices(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedDevices.size === filteredDevices.length) {
      setSelectedDevices(new Set())
    } else {
      setSelectedDevices(new Set(filteredDevices.map(d => d.id)))
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Inventory Command
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time device tracking and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-input hover:bg-white/5" onClick={handleSync}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button variant="outline" className="glass-input hover:bg-white/5" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass-panel border-l-4 border-l-blue-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Devices</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.total}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-green-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ready</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.ready}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-blue-400 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Process</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.inProcess}</h3>
              </div>
              <div className="p-2 bg-blue-400/10 rounded-lg text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-orange-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Needs Repair</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.needsRepair}</h3>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-l-4 border-l-purple-500 hover-card-effect">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Distributed</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats.distributed}</h3>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Wifi className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="glass-panel">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory #, brand, model, serial..."
                className="pl-9 glass-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Ready">Ready</option>
                <option value="In Process">In Process</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Distributed">Distributed</option>
              </select>
              <select
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Tablet">Tablet</option>
                <option value="Phone">Phone</option>
                <option value="Printer">Printer</option>
              </select>
            </div>
          </div>
          {selectedDevices.size > 0 && (
            <div className="mt-4 flex items-center gap-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-sm font-medium">{selectedDevices.size} selected</span>
              <Button size="sm" variant="outline" className="h-8">
                <QrCode className="h-3 w-3 mr-2" /> Generate QR
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Edit className="h-3 w-3 mr-2" /> Bulk Edit
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-red-400 hover:text-red-300">
                <Trash2 className="h-3 w-3 mr-2" /> Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Table */}
      <Card className="glass-panel flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase bg-white/5 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/5"
                    checked={selectedDevices.size === filteredDevices.length && filteredDevices.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium">Inventory #</th>
                <th className="px-4 py-3 text-left font-medium">Device</th>
                <th className="px-4 py-3 text-left font-medium">Serial</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Condition</th>
                <th className="px-4 py-3 text-left font-medium">Date Added</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No devices found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const TypeIcon = typeIcons[device.type] || HardDrive
                  return (
                    <tr key={device.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-white/5"
                          checked={selectedDevices.has(device.id)}
                          onChange={() => toggleSelectDevice(device.id)}
                        />
                      </td>
                      <td className="px-4 py-4 font-mono text-primary font-medium">
                        {device.inventoryNumber}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{device.brand} {device.model}</div>
                            {device.specs && (
                              <div className="text-xs text-muted-foreground">{device.specs}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {device.serialNumber}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={getStatusStyle(device.status)}>
                          {device.status}
                        </Badge>
                        {device.assignedTo && (
                          <div className="text-xs text-muted-foreground mt-1">→ {device.assignedTo}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${getConditionStyle(device.condition)}`}>
                          {device.condition}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground text-sm">
                        {new Date(device.dateAdded).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredDevices.length} of {devices.length} devices</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
