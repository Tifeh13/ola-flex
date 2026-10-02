export function formatPrice(price) {
  return `₦${Number(price).toLocaleString()}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getAvailabilityColor(status) {
  switch (status) {
    case 'in_stock': return 'text-green-400';
    case 'low_stock': return 'text-yellow-400';
    case 'out_of_stock': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

export function getAvailabilityLabel(status) {
  switch (status) {
    case 'in_stock': return 'In Stock';
    case 'low_stock': return 'Low Stock';
    case 'out_of_stock': return 'Out of Stock';
    default: return 'Unknown';
  }
}

// Safely parse a product's specifications JSON. Malformed data from an old
// row must not crash the whole product page — fall back to an empty object.
export function parseSpecs(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getImageUrl(imageUrl) {
  if (!imageUrl || imageUrl === '/placeholder-watch.svg') return '/placeholder-watch.svg';
  return imageUrl;
}
