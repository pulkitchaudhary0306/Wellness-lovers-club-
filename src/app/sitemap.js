export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wellnessloversclub.com";
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/our-philosophy",
    "/offerings",
    "/offerings/luxury-stays",
    "/offerings/movement-mindfulness",
    "/offerings/products",
    "/offerings/products/energetika369",
    "/offerings/products/environics",
    "/offerings/spa-healing",
    "/offerings/wellness-retreats",
    "/destinations",
    "/benefits",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/membership",
    "/membership/enroll",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/offerings" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/offerings") || route === "/membership" ? 0.8 : 0.6,
  }));
}
