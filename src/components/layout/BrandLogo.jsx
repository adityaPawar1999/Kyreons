export default function BrandLogo({ className = '', onClick }) {
  return <a className={`wordmark brand-logo ${className}`.trim()} href="#home" onClick={onClick} aria-label="Kyreons home">
    <svg className="brand-logo-mark" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <path d="M4 4h28v28H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 9v18m13-18L12 18l13 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M4 11h4m20 14h4" fill="none" stroke="var(--accent)" strokeWidth="2" />
    </svg>
    <span>KYREONS<span className="wordmark-dot">®</span></span>
  </a>;
}
