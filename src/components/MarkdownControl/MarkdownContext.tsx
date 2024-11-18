'use client'

import { createContext, useContext } from 'react'

interface ViewerState {
  isOpen: boolean
  src: string
  alt: string
}

interface MarkdownContextType {
  viewerProps: ViewerState
  openViewer: (src: string, alt: string) => void
  closeViewer: () => void
}

export const MarkdownContext = createContext<MarkdownContextType | null>(null)

export function useMarkdown() {
  const context = useContext(MarkdownContext)
  if (!context) {
    throw new Error('useMarkdown must be used within a MarkdownProvider')
  }
  return context
}