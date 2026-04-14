import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/landing.html',
        },
        {
          source: '/login',
          destination: '/login.html',
        },
        {
          source: '/register',
          destination: '/register.html',
        },
      ],
    }
  },
}

export default nextConfig
