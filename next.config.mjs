/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config
  },
  webpackDevMiddleware: (config) => {
    return config
  },
  server: {
    hostname: '0.0.0.0',
    port: 5000
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig