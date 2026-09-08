"use client";

import Link from "next/link";
import "./ProductCategoryTabs.css";

export default function ProductCategoryTabs({ activeCategory = "all" }) {
  const tabs = [
    {
      id: "energetika369",
      label: "Energetika369",
      href: "/offerings/products/energetika369",
      badge: "Bio-Frequency",
      icon: "⚡"
    },
    {
      id: "environics",
      label: "Environics",
      href: "/offerings/products/environics",
      badge: "50% OFF Privilege",
      icon: "🛡️"
    }
  ];

  return (
    <nav className="product-category-tabs-wrapper" aria-label="Product Category Selection">
      <div className="product-category-tabs" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              className={`product-category-tab ${isActive ? "active" : ""}`}
              id={`product-tab-${tab.id}`}
              aria-controls={`product-panel-${tab.id}`}
            >
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.badge && (
                <span className={`tab-badge ${tab.id === "environics" ? "tab-badge-gold" : ""}`}>
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
