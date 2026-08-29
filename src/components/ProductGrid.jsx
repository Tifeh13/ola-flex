import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, emptyMessage = 'No products found.' }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
