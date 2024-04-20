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
  images: {
    domains: ["minio"],
  },
};

module.exports = nextConfig;
