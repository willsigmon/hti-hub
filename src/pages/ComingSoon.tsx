import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function ComingSoon() {
  const location = useLocation()
  const pageName = location.pathname.slice(1).replace(/-/g, ' ')

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-hti-orange/10 rounded-full flex items-center justify-center mb-6">
        <Construction className="text-hti-orange" size={40} />
      </div>
      <h1 className="text-2xl font-bold text-hti-navy capitalize mb-2">
        {pageName || 'Page'} Coming Soon
      </h1>
      <p className="text-gray-500 max-w-md">
        This section is under development. Check back soon for updates on{' '}
        {pageName || 'this feature'}.
      </p>
    </div>
  )
}
