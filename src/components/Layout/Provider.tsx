'use client'

import SharerBackground from '@/components/ShaderBackground/ShaderBackgroundDynamic'

import { baseConfig } from '@/config/base'
import { ThemeProvider } from 'next-themes'

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SharerBackground />
      <ThemeProvider attribute="class" defaultTheme={baseConfig.theme}>
        {children}
      </ThemeProvider>
    </>
  )
}
