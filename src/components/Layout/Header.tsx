'use client'

import { cn } from '@/lib/utils'
import { navbar } from '@/config/navbar'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/shadcnui/button'

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className={cn(
        'flex items-center justify-between px-4',
        'bg-background/80 backdrop-saturate-50 backdrop-blur-sm',
        'rounded-full border text-muted-foreground',
        'fixed top-10 left-1/2 -translate-x-1/2 z-50',
        'w-[90%] md:w-2/5'
      )}
    >
      <div className="text-xl font-bold h-full">
        <Link href="/">
          <Logo className='cursor-pointer text-2xl'/>
        </Link>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Desktop navigation */}
      <nav className="hidden md:flex space-x-4 relative">
        {navbar.map((item) => (
          <Link key={item.label} href={item.href} className="relative group py-2 pb-2.5">
            <span className="text-sm hover:text-gray-300">{item.label}</span>
            <span
              className={cn(
                'absolute left-1/2 -translate-x-1/2 bottom-0 w-[1rem] h-0.5 bg-primary rounded-md transition-all duration-300 ease-in-out',
                pathname === item.href ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
              )}
            />
          </Link>
        ))}
      </nav>

      {/* Mobile navigation */}
      <nav
        className={cn(
          'md:hidden absolute top-full left-0 right-0 mt-2',
          'bg-background/95 backdrop-blur-sm border rounded-2xl',
          'py-2 px-4',
          isOpen ? 'block' : 'hidden'
        )}
      >
        {navbar.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              'block py-2 text-sm',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
