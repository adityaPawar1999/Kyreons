export default function ActionButton({ as: Element = 'button', className = '', children, ...props }) {
  return <Element className={className} {...props}>{children}</Element>;
}
