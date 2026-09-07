export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wellnessloversclub.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/login",
          "/logout",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/verify-otp",
          "/api/",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
