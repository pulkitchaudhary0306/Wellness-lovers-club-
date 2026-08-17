import { PARTNERS_DATA, getPartnerBySlug, getAllPartners } from "@/data/partnerOffers";

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "https://cms.wellnessloversclub.com/wp-json";

/**
 * Service to fetch member privileges and partner-specific offers
 */
export async function fetchAllPartners() {
  try {
    const res = await fetch(`${API_URL}/custom/v1/privileges`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) {
      return getAllPartners();
    }
    const data = await res.json();
    if (data && data.success && Array.isArray(data.partners)) {
      return data.partners;
    }
    return getAllPartners();
  } catch (error) {
    // Fallback to local dataset seamlessly
    return getAllPartners();
  }
}

/**
 * Fetch a single partner and ONLY its offers by slug
 */
export async function fetchPartnerBySlug(slug) {
  if (!slug) return null;
  const localPartner = getPartnerBySlug(slug);

  try {
    const res = await fetch(`${API_URL}/custom/v1/privileges?partner=${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) {
      return localPartner;
    }
    const data = await res.json();
    if (data && data.success && data.partner) {
      return data.partner;
    }
    return localPartner;
  } catch (error) {
    return localPartner;
  }
}
