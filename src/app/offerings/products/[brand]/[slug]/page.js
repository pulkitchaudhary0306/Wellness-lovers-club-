import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/Products/ProductDetailClient";
import {
  PRODUCTS_DATA,
  getProductBySlug,
  getRelatedProducts
} from "@/data/productsData";

import "../../../wellness-retreats/retreats.css";
import "../../../offerings.css";
import "../../products.css";

const SITE_URL = "https://www.wellnessloversclub.com";

export async function generateStaticParams() {
  const params = [];
  for (const brand of PRODUCTS_DATA) {
    for (const product of brand.products) {
      params.push({
        brand: brand.id,
        slug: product.id
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { brand, slug } = await params;
  const found = getProductBySlug(brand, slug);

  if (!found) {
    return {
      title: "Product Not Found | Wellness Lovers Club"
    };
  }

  const { product, brand: brandObj } = found;
  const brandName = brandObj.brand || brandObj.name;
  const canonicalUrl = `${SITE_URL}/offerings/products/${brandObj.id}/${product.id}`;
  const title = `${product.name} — ${brandName} | Wellness Lovers Club`;
  const description = product.shortDesc || product.overview?.slice(0, 155);

  return {
    title,
    description,
    keywords: [
      product.name,
      brandName,
      product.category,
      ...(product.idealFor || []),
      "Wellness Lovers Club",
      "Luxury Wellness Technology"
    ],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Wellness Lovers Club",
      type: "website",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 900,
          alt: `${product.name} — ${brandName}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image]
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { brand, slug } = await params;
  const found = getProductBySlug(brand, slug);

  if (!found) {
    notFound();
  }

  const { product, brand: brandObj } = found;
  const brandName = brandObj.brand || brandObj.name;
  const relatedProducts = getRelatedProducts(product.id, 3);
  const canonicalUrl = `${SITE_URL}/offerings/products/${brandObj.id}/${product.id}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: (product.gallery || []).map((g) =>
      `${SITE_URL}${typeof g === "string" ? g : g.src}`
    ),
    brand: {
      "@type": "Brand",
      name: brandName
    },
    category: product.category,
    url: canonicalUrl
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Offerings",
        item: `${SITE_URL}/offerings`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Products",
        item: `${SITE_URL}/offerings/products`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: brandName,
        item: `${SITE_URL}/offerings/products/${brandObj.id}`
      },
      {
        "@type": "ListItem",
        position: 5,
        name: product.name,
        item: canonicalUrl
      }
    ]
  };

  return (
    <article className="offerings-page pdp-page-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={product}
        brand={brandObj}
        relatedProducts={relatedProducts}
      />
    </article>
  );
}
