
import { cn } from '@/lib/utils'
import { baseConfig } from '@/config/base'
import { rougeScript } from '@/styles/fontHouse'

export default function Logo({ className }: { className?: string }) {
  return <span className={
    cn('hover:text-primary font-semibold cursor-default', rougeScript.className, className)
  }>{baseConfig.title}</span>
}