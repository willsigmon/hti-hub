import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { HubbyProvider } from '@/contexts/HubbyContext'
import { OnboardingProvider } from '@/components/Onboarding/OnboardingProvider'
import Sidebar from '@/components/Layout/Sidebar'
import Header from '@/components/Layout/Header'
import { Hubby } from '@/components/Hubby/Hubby'
import './globals.css'

export const metadata: Metadata = {
  title: 'HTI H.U.B. - Mission Control',
  description: 'HubZone Technology Initiative Command Center',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#010204',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <HubbyProvider>
          <OnboardingProvider>
            <Toaster position="top-right" richColors closeButton />
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                  {children}
                </main>
              </div>
              <Hubby />
            </div>
          </OnboardingProvider>
        </HubbyProvider>
      </body>
    </html>
  )
}
