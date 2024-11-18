import { MoveUpRight, Mail } from 'lucide-react'
import Logo from './Logo'
import { FaXTwitter, FaGithub } from 'react-icons/fa6'
import { baseConfig } from '@/config/base'
import { Button } from '@/components/shadcnui/button'

export default function Footer() {
  return (
    <footer className="mb-16 px-8">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <MoveUpRight size={14} />
            <p className="ml-2 h-7">rss</p>
          </a>
        </li>
      </ul>
      <div className='flex items-center justify-between mt-8 '>
        <p className="text-neutral-600 dark:text-neutral-300 flex items-center">
          <span className='text-sm'>© {new Date().getFullYear()}</span>
          <Logo className="ml-2 text-xl" />
        </p>

        <ul className='flex items-center'>
          <li>
            {
              baseConfig.socialMedia.twitter &&
              <Button variant="ghost" asChild>
                <a
                  className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={baseConfig.socialMedia.twitter}
                >
                  <FaXTwitter size={20} />
                </a>
              </Button>
            }
            
          </li>
          <li>
            {
              baseConfig.socialMedia.github &&
              <Button variant="ghost" asChild>
                <a
                  className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={baseConfig.socialMedia.github}
                >
                  <FaGithub size={20} />
                </a>
              </Button>
            }
          </li>
          <li>
            {
              baseConfig.socialMedia.email &&
              <Button variant="ghost" asChild>
                <a
                  className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`mailto:${baseConfig.socialMedia.email}`}
                >
                  <Mail size={20} />
                </a>
              </Button>
            }
          </li>
        </ul>

      </div>
    </footer>
  )
}
