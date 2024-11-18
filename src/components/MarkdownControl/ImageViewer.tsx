'use client'

import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogPortal,
  DialogOverlay
} from '@/components/shadcnui/dialog'
import { cn } from '@/lib/utils'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface ImageViewerProps {
  isOpen: boolean
  src: string
  alt: string
  onClose: () => void
}

export function ImageViewer({ isOpen, src, alt, onClose }: ImageViewerProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPortal>
        {/* <DialogOverlay className="bg-transparent backdrop-blur-xl" /> */}
        <DialogContent
          className={cn(
            'w-screen h-screen max-w-none max-h-none p-0 border-none bg-transparent',
            'data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0',
            'data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0'
          )}
          overlayClassName="bg-background/30 backdrop-blur-xl"
        >
          <VisuallyHidden.Root>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden.Root>
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
