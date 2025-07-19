import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rigger Platform - Workforce Management Dashboard',
  description: 'Enterprise-grade workforce management and job marketplace for riggers and construction workers',
  keywords: [
    'rigger',
    'construction',
    'workforce management', 
    'job marketplace',
    'safety compliance',
    'crane operations',
    'enterprise dashboard'
  ],
  authors: [{ name: 'Tiation', url: 'https://tiation.com' }],
  creator: 'Tiation',
  publisher: 'Tiation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Rigger Platform - Workforce Management Dashboard',
    description: 'Enterprise-grade workforce management and job marketplace for riggers and construction workers',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Rigger Platform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rigger Platform - Workforce Management Dashboard',
    description: 'Enterprise-grade workforce management and job marketplace for riggers and construction workers',
    creator: '@tiation',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}