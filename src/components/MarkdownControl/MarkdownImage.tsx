'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useMarkdown } from './MarkdownContext'

interface MarkdownImageProps {
  src: string
  alt: string
}

export function MarkdownImage({ src, alt }: MarkdownImageProps) {
  const { openViewer } = useMarkdown()

  return (
    <span className='flex flex-col items-center my-8'>
      <button
        onClick={() => openViewer(src, alt || '')}
        className="relative block w-full overflow-hidden rounded-sm"
      >
        <Image
          src={src}
          alt={alt || ''}
          width={600}
          height={300}
          className={cn(
            'rounded-sm object-cover transition-all hover:scale-105',
            'aspect-[2/1]'
          )}
        />
      </button>
      {alt && (
        <span className="mt-2 text-center text-xs text-muted-foreground/80">
          {alt}
        </span>
      )}
    </span>
  )
}
