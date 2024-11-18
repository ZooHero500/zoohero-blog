import { baseConfig } from '@/config/base'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseConfig.baseUrl}/sitemap.xml`
  }
}
