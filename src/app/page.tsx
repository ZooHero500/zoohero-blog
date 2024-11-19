import Link from 'next/link'
import Images from 'next/image'
import { Badge } from '@/components/shadcnui/badge'
import { Separator } from '@/components/shadcnui/separator'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcnui/tooltip'

import { stacks, tools, hobbies } from '@/config/about'
import { RecentPosts } from '@/components/RecentPosts'

export default function Page() {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-xl font-bold">我和这个世界不太熟</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          在这个疯狂的互联网世界里，我是个执着的造物者。不是因为热爱代码，而是渴望创造美好的事物。
          就像王小波说的："人都是在寂寞中产生好奇心的，而且是对一切事物产生好奇心。"
        </p>
      </div>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">Works</h2>
        <div className="space-y-2 text-sm pt-2">
          <p>
            <span className="text-muted-foreground mr-5">2021-至今:</span>
            ZKYT，B端业务
          </p>
          <p>
            <span className="text-muted-foreground mr-5">2017-2021:</span>
            QunYingYong，Saas小程序
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Some Stack</h2>
        <div className="flex flex-wrap gap-2 pt-2">
          {stacks.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Some hobbies</h2>
        <p className="text-muted-foreground text-xs">
          Living itself is a form of happiness, isn't it?
        </p>
        <div className="flex flex-wrap gap-2 pt-2 mt-2">
          {hobbies.map((hobby) => (
            <Badge key={hobby} variant="secondary">
              {hobby}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Tools</h2>
        <p className="text-muted-foreground text-xs">
          Some of the tools I commonly use
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(tools).map(([tool, link]) => (
            <TooltipProvider key={tool}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={link} target="_blank">
                    <Images
                      src={`/images/${tool.toLowerCase()}.png`}
                      alt={tool}
                      width={50}
                      height={50}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tool}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* <h3 className="my-4">感谢赛博菩萨：</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="https://www.cloudflare.com/zh-CN/" target="_blank">
                <div className="bg-white rounded-sm w-20 h-10">
                  <Images
                    src={`/images/cloudflare.svg`}
                    alt={'cloudflare'}
                    width={100}
                    height={50}
                    className="object-contain"
                  />
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cloudflare</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recent Posts</h2>
        <RecentPosts />
      </section>
    </section>
  )
}
