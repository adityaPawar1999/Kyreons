export default function IconButton({ children, className = '', ...props }) {
  return <button className={`icon-button ${className}`} {...props}>{children}</button>;
}
