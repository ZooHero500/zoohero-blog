import type { Metadata } from 'next'
import { noto } from '@/styles/fontHouse'

import { baseConfig } from '@/config/base'
import Main from '@/components/Layout/Main'
import '../styles/globals.css'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL(baseConfig.baseUrl),
  title: baseConfig.title,
  description: baseConfig.description,
  openGraph: {
    title: baseConfig.title,
    description: baseConfig.description,
    url: `${baseConfig.baseUrl}/og`,
    siteName: baseConfig.title,
    locale: 'zh-CN',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn('noto-sans', noto.className)} suppressHydrationWarning={true}>
      <body className="antialiased min-h-screen">
        <Main>{children}</Main>
      </body>
    </html>
  )
}
