/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  compress: true,
  experimental: {
    optimizeCss: process.env.NODE_ENV === "production",
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
