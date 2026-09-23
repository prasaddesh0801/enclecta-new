import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimisation: local assets live in /public, remote ones must be
  // whitelisted here before next/image will load them.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // { protocol: "https", hostname: "cdn.enclecta.com" },
    ],
  },

  // Inline small SVGs imported as React components is intentionally NOT enabled;
  // icons live in /public/icons and are rendered with next/image or inline JSX.
  poweredByHeader: false,
};

export default nextConfig;
