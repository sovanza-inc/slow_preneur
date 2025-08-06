import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // We run eslint in the root
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
