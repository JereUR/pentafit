import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  serverExternalPackages: ["@node-rs/argon2"],
}

export default nextConfig
