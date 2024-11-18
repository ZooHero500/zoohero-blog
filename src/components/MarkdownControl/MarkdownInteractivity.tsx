'use client'

import { useState } from 'react'
import { ImageViewer } from './ImageViewer'
import { MarkdownContext } from './MarkdownContext'

interface MarkdownInteractivityProps {
  children: React.ReactNode
}

export function MarkdownInteractivity({ children }: MarkdownInteractivityProps) {
  const [viewerProps, setViewerProps] = useState({
    isOpen: false,
    src: '',
    alt: ''
  })

  const contextValue = {
    viewerProps,
    openViewer: (src: string, alt: string) => {
      setViewerProps({ isOpen: true, src, alt })
    },
    closeViewer: () => {
      setViewerProps(prev => ({ ...prev, isOpen: false }))
    }
  }

  return (
    <MarkdownContext.Provider value={contextValue}>
      {children}
      <ImageViewer
        isOpen={viewerProps.isOpen}
        src={viewerProps.src}
        alt={viewerProps.alt}
        onClose={contextValue.closeViewer}
      />
    </MarkdownContext.Provider>
  )
}
