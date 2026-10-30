import { getAllProducts } from "@/data/productsData";

export default function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.wellnessloversclub.com";
  const lastModified = new Date();

  const staticRoutes = [
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
    "/membership/enroll"
  ];

  const productRoutes = getAllProducts().map((p) => p.detailUrl);
  const allRoutes = [...staticRoutes, ...productRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency:
      route === "" || route === "/offerings" || route === "/offerings/products"
        ? "daily"
        : "weekly",
    priority:
      route === ""
        ? 1.0
        : route.startsWith("/offerings/products") ||
          route.startsWith("/offerings") ||
          route === "/membership"
        ? 0.85
        : 0.6
  }));
}
