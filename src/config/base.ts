
type socialMedia = {
  [key: string]: string
}

interface BaseConfig {
  baseUrl: string
  title: string
  description: string

  socialMedia: socialMedia

  theme?: 'dark' | 'light'
}

export const baseConfig: BaseConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  title: 'ZooHero',
  description: 'A blog of a phony perfectionist',


  socialMedia: {
    twitter: 'https://x.com/zooheroes',
    github: 'https://github.com/ZooHero500',
    email: 'oh@zoohero.me'
  },

  theme: 'dark'
}
