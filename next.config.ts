import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'meatfreaks.co.uk' }],
        destination: 'https://www.meatfreaks.co.uk/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
