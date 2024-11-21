'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export function Comments() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="mt-10 pt-10 border-t">
      <Giscus
        id="comments"
        repo="ZooHero500/zoohero-blog"
        repoId="R_kgDONRw58g"
        category="General"
        categoryId="DIC_kwDONRw58s4Cke-Q"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
        strict="0"
      />
    </div>
  )
}
