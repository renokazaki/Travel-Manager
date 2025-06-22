/** @type {import('next').NextConfig} */
const nextConfig = {
// Next.js 15の新しい静的レンダリングを無効化
experimental: {
  dynamicIO: false,
},

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
