/**
 * Builds a wa.me link from a farmer's actual mobile number, rather than a
 * single hardcoded number shared across every listing.
 * Returns null if the farmer hasn't set a mobile number, so callers can
 * disable/hide the contact button instead of linking to a fake number.
 */
export function buildWhatsAppLink(
  mobile: string | null | undefined,
  farmerName: string,
  crop: string
): string | null {
  if (!mobile) return null;
  const digits = mobile.replace(/[^\d]/g, "");
  if (!digits) return null;
  // Assume Indian numbers if no country code was stored (10-digit local number).
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
  const text = `Hi ${farmerName}, I am interested in your listing for ${crop}.`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(text)}`;
}
