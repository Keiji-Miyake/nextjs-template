/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
};

module.exports = nextConfig;
