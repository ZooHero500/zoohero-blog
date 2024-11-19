import { getGallery } from '@/directus/gallery'
import { Separator } from '@/components/shadcnui/separator'
import { GalleryGrid } from '@/components/GalleryGrid'

export const revalidate = 3600

export default async function GalleryPage() {
  const gallery = await getGallery()

  return (
    <div className="w-full">
      <div className="container max-w-4xl mx-auto px-8 pb-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <h1 className="inline-block font-heading text-2xl tracking-tight lg:text-3xl">
            Gallery
          </h1>
        </div>
        <Separator className="my-8" />
      </div>

      <GalleryGrid images={gallery} />
    </div>
  )
}
