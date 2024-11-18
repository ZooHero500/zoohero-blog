/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'directus.zoohero.me',
        port: '',
        pathname: '/assets/**'
      }
    ]
  }
}

module.exports = nextConfig
