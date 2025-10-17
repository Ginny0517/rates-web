/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // basePath: '/rates-web',
  images: {
    unoptimized: true,
  },
  // 確保路徑別名在 Vercel 上正確工作
  experimental: {
    esmExternals: true,
  },
}

module.exports = nextConfig 