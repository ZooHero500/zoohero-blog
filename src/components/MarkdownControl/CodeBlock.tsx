'use client'

import * as React from 'react'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { cn } from '@/lib/utils'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

export function CodeBlock({ className, children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    copy(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 从 className 或 language prop 中获取语言
  const codeLanguage = language || (className?.match(/language-(\w+)/)?.[1] || '')

  return (
    <div className="group relative my-4">
      <div className="absolute right-4 top-4">
        <button
          onClick={onCopy}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md border transition-all',
            copied
              ? 'border bg-background text-white'
              : 'border-muted-foreground/20 hover:bg-muted'
          )}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-muted p-4">
        {codeLanguage && (
          <div className="mb-2 text-xs text-muted-foreground">{codeLanguage}</div>
        )}
        <pre className="text-sm">
          <SyntaxHighlighter
            style={dracula}
            language={codeLanguage || 'text'}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent'
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </pre>
      </div>
    </div>
  )
}
