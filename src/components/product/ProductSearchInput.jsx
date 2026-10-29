import SearchIcon from '@mui/icons-material/Search';

export default function ProductSearchInput({ value, onChange, onFocus, className = '' }) {
  return (
    <label className={`product-search-input ${className}`}>
      <SearchIcon aria-hidden="true" />
      <span className="sr-only">Search shirts by name, design, or color</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder="SEARCH SHIRTS, COLORS, DESIGNS"
        aria-label="Search shirts by name, design, or color"
      />
    </label>
  );
}
