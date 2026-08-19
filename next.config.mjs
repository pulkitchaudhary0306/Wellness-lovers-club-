/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow images from your WordPress site (avatars, featured images, etc.)
        // Update 'hostname' to match your actual WordPress domain.
        protocol: "https",
        hostname: "your-wordpress-site.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        // Unsplash (used as fallback avatar placeholder)
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
