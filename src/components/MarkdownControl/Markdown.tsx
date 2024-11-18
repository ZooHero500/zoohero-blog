import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import Link from 'next/link'
import { CodeBlock } from './CodeBlock'
import { MarkdownImage } from './MarkdownImage'
import { MarkdownInteractivity } from './MarkdownInteractivity'
import { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const components: Components = {
    // 自定义段落样式
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    // 自定义标题样式
    h1: ({ children }) => (
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h4>
    ),
    // 自定义列表样式
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
    // 自定义链接样式
    a: ({ href, children }) => {
      const isInternal = href?.startsWith('/')
      if (isInternal) {
        return (
          <Link
            href={href}
            className="font-medium underline underline-offset-4"
          >
            {children}
          </Link>
        )
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4"
        >
          {children}
        </a>
      )
    },
    // 自定义图片样式
    img: ({ src, alt }) => {
      if (!src) return null
      return <MarkdownImage src={src} alt={alt || ''} />
    },
    // 自定义代码块样式
    pre: ({ children }) => {
      const childProps = (children as any)?.props
      const code = childProps?.children || ''
      const className = childProps?.className || ''

      return <CodeBlock className={className}>{code}</CodeBlock>
    },
    // 行内代码样式
    code: ({ className, children }) => {
      // 如果是代码块的一部分，直接返回内容
      if (className?.includes('language-')) {
        return <>{children}</>
      }
      // 行内代码样式
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {children}
        </code>
      )
    },
    // 自定义引用样式
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    // 自定义表格样式
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    )
  }

  return (
    <MarkdownInteractivity>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeRaw]}
        className="prose-sm prose-neutral dark:prose-invert max-w-none"
        components={components}
      >
        {content}
      </ReactMarkdown>
    </MarkdownInteractivity>
  )
}
