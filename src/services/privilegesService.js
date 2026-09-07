import { getPartnerBySlug, getAllPartners } from "@/data/partnerOffers";
import { wpGet } from "@/lib/wpFetch";

/**
 * Service to fetch member privileges and partner-specific offers
 */
export async function fetchAllPartners() {
  try {
    const data = await wpGet(
      "/wp-json/custom/v1/privileges",
      { unauthenticated: true }
    );
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
    const data = await wpGet(
      `/wp-json/custom/v1/privileges?partner=${encodeURIComponent(slug)}`,
      { unauthenticated: true }
    );
    if (data && data.success && data.partner) {
      return data.partner;
    }
    return localPartner;
  } catch (error) {
    return localPartner;
  }
}
