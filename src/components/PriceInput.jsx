export default function PriceInput({ value, onChange, required, placeholder }) {
  const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    const str = String(num).replace(/[^0-9]/g, '');
    if (!str) return '';
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(raw);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm font-medium">₦</span>
      <input
        type="text"
        inputMode="numeric"
        value={formatNumber(value)}
        onChange={handleChange}
        required={required}
        placeholder={placeholder || '0'}
        className="input-luxury pl-8 pr-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}