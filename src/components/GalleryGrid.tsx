'use client'

import Image from 'next/image'
import { ImageViewer } from '@/components/MarkdownControl/ImageViewer'
import { useState } from 'react'
import { Gallery } from '@/types/gallery'

interface GalleryGridProps {
  images: Gallery[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.1">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-[3/2] group cursor-zoom-in"
            onClick={() => {
              const imageUrl = `/api/image?id=${image.image}`
              setSelectedImage(imageUrl)
            }}
          >
            <Image
              src={`/api/image?id=${image.image}`}
              alt={image.title || ''}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-101"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 group-hover:scale-101 transition-all duration-300" />
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 group-hover:scale-101 transition-all duration-300">
                <h3 className="text-xs font-medium">{image.title}</h3>
                {image.description && (
                  <p className="text-xs text-gray-200 line-clamp-2 mt-1">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageViewer
          isOpen
          src={selectedImage}
          alt={''}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  )
}
