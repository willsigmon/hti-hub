import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function ComingSoon() {
  const location = useLocation()
  const pageName = location.pathname.slice(1).replace(/-/g, ' ')

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
        <Construction className="text-primary" size={40} />
      </div>
      <h1 className="text-2xl font-bold text-foreground capitalize mb-2 font-heading">
        {pageName || 'Page'} Coming Soon
      </h1>
      <p className="text-muted-foreground max-w-md">
        This section is under development. Check back soon for updates on{' '}
        {pageName || 'this feature'}.
      </p>
    </div>
  )
}
