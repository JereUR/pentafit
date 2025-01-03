import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@node-rs/argon2"],
}

export default nextConfig
