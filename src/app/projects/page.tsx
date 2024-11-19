import { getProjects } from '@/directus/projects'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/shadcnui/button'
import { PackageOpen, SquareArrowOutUpRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/shadcnui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcnui/tooltip'
import { Separator } from '@/components/shadcnui/separator'

export const revalidate = 3600

async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <h1 className="inline-block font-heading text-2xl tracking-tight lg:text-3xl">
          Projects
        </h1>
      </div>
      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300 relative rounded-lg"
          >
            <CardHeader className="p-3">
              <div className="relative aspect-[16/9] rounded-md overflow-hidden">
                <Image
                  src={`/api/image?id=${project.cover}`}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <CardTitle className="text-md">{project.title}</CardTitle>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </p>
            </CardContent>

            <TooltipProvider>
              <div className="absolute left-0 top-0  w-full h-full  backdrop-blur-sm transition-all opacity-0 hover:opacity-100 flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <PackageOpen />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>About</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className='ml-2' variant="outline" size="icon" asChild>
                      <Link href={project.url} target="_blank">
                        <SquareArrowOutUpRight />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Link</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
