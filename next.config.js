/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
    taint: true,
  },
};

module.exports = nextConfig;
