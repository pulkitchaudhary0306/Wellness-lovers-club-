"use client";

import React, { useState, useMemo } from "react";
import { PRODUCT_CATEGORIES, getAllProducts } from "@/data/productsData";
import ProductCardWithModal from "./ProductCardWithModal";

export default function ProductCatalogueExplorer({
  initialBrand = "all",
  initialCategory = "all"
}) {
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const allProducts = useMemo(() => getAllProducts(), []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesBrand =
        selectedBrand === "all" || product.brandId === selectedBrand;
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      if (!matchesBrand || !matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const searchableText = [
        product.name,
        product.tagline,
        product.shortDesc,
        product.category,
        product.brandName,
        ...(product.highlights || []),
        ...(product.idealFor || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [allProducts, selectedBrand, selectedCategory, searchQuery]);

  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId);
    if (brandId === "environics") {
      setSelectedCategory("emr-protection");
    } else if (selectedCategory === "emr-protection" && brandId === "energetika369") {
      setSelectedCategory("all");
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const catObj = PRODUCT_CATEGORIES.find((c) => c.id === catId);
    if (catObj?.brandId && selectedBrand !== "all" && selectedBrand !== catObj.brandId) {
      setSelectedBrand("all");
    }
  };

  return (
    <section className="wlc-catalogue-explorer" id="complete-product-catalogue">
      <div className="wlc-explorer-header">
        <span className="wlc-explorer-eyebrow">COMPLETE PRODUCT CATALOGUE</span>
        <h2 className="wlc-explorer-title">
          Browse by Technology, Modality &amp; Brand
        </h2>
        <p className="wlc-explorer-subtitle">
          Explore our curated collection of 15 authentic wellness technology
          systems and electromagnetic protection solutions. Click any product
          for complete technical specifications, multi-angle studio galleries,
          and member enquiry privileges.
        </p>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="wlc-explorer-controls">
        {/* Top Row: Brand Switcher + Search Input */}
        <div className="wlc-explorer-top-bar">
          <div className="wlc-brand-pills" role="tablist" aria-label="Filter by Brand">
            <button
              type="button"
              role="tab"
              aria-selected={selectedBrand === "all"}
              className={`wlc-brand-pill ${selectedBrand === "all" ? "active" : ""}`}
              onClick={() => handleBrandChange("all")}
            >
              All Brands ({allProducts.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedBrand === "energetika369"}
              className={`wlc-brand-pill ${
                selectedBrand === "energetika369" ? "active" : ""
              }`}
              onClick={() => handleBrandChange("energetika369")}
            >
              Energetika369 (11)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedBrand === "environics"}
              className={`wlc-brand-pill is-environics ${
                selectedBrand === "environics" ? "active" : ""
              }`}
              onClick={() => handleBrandChange("environics")}
            >
              <span>Environics (4)</span>
              <span className="wlc-pill-offer">50% OFF</span>
            </button>
          </div>

          <div className="wlc-search-box">
            <svg
              className="wlc-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PEMF, rTMS, NLS, Rife, Iridoscope, EMR..."
              className="wlc-search-input"
              aria-label="Search products by name or modality"
            />
            {searchQuery && (
              <button
                type="button"
                className="wlc-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="wlc-category-pills"
          role="tablist"
          aria-label="Filter by Product Category"
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`wlc-cat-pill ${
                selectedCategory === cat.id ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filter Reset */}
      <div className="wlc-explorer-meta">
        <p className="wlc-results-count">
          Showing <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{allProducts.length}</strong> curated wellness products
        </p>
        {(selectedBrand !== "all" ||
          selectedCategory !== "all" ||
          searchQuery.trim() !== "") && (
          <button
            type="button"
            className="wlc-reset-filters-btn"
            onClick={() => {
              setSelectedBrand("all");
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="wlc-lux-grid">
          {filteredProducts.map((product) => (
            <ProductCardWithModal
              key={`${product.brandId}-${product.id}`}
              product={product}
              brandName={product.brandName}
              brandId={product.brandId}
            />
          ))}
        </div>
      ) : (
        <div className="wlc-empty-state">
          <h3>No matching products found</h3>
          <p>
            Try clearing your search term or selecting &ldquo;All Products&rdquo;
            to view the complete Wellness Lovers Club catalogue.
          </p>
          <button
            type="button"
            className="wlc-lux-btn-primary"
            onClick={() => {
              setSelectedBrand("all");
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Show All Products
          </button>
        </div>
      )}
    </section>
  );
}
