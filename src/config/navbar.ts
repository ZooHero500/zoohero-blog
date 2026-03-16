interface NavbarItem {
  label: string
  href: string
}

export const navbar: NavbarItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' }
]
