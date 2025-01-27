/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Pathway',
  assetPrefix: '/Pathway/',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig