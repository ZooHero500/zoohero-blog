import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/shadcnui/button'
import Link from 'next/link'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

interface BasePaginationLinkProps {
  isActive?: boolean
  disabled?: boolean
  className?: string
  size?: ButtonProps['size']
  'aria-label'?: string
  children?: React.ReactNode
}

interface LinkPaginationProps extends BasePaginationLinkProps {
  href: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

interface ButtonPaginationProps extends BasePaginationLinkProps {
  href?: undefined
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

type PaginationLinkProps = LinkPaginationProps | ButtonPaginationProps

const PaginationLink = ({
  className,
  isActive,
  disabled,
  size = 'icon',
  href,
  ...props
}: PaginationLinkProps) => {
  const commonClassNames = cn(
    buttonVariants({
      variant: isActive ? 'outline' : 'ghost',
      size,
    }),
    disabled && 'pointer-events-none opacity-50',
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={commonClassNames}
        {...(props as Omit<LinkPaginationProps, 'href'>)}
      />
    )
  }

  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      className={commonClassNames}
      disabled={disabled}
      {...(props as ButtonPaginationProps)}
    />
  )
}
PaginationLink.displayName = 'PaginationLink'

interface NavigationProps extends BasePaginationLinkProps {
  href?: string
}

const PaginationPrevious = ({
  className,
  href,
  ...props
}: NavigationProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    href={href}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  href,
  ...props
}: NavigationProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    href={href}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
