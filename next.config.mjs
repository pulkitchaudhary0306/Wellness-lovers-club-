/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        // Allow images from your WordPress site (avatars, featured images, etc.)
        // Update 'hostname' to match your actual WordPress domain.
        protocol: "https",
        hostname: "cms.wellnessloversclub.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        // Unsplash (used as fallback avatar placeholder)
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const wpBase = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.wellnessloversclub.com").replace(/\/$/, "");
    return [
      {
        source: "/wp-json/:path*",
        destination: `${wpBase}/wp-json/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/our-philosophy",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/membership",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
