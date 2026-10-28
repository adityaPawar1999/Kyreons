import StorefrontLayout from '../../components/layout/StorefrontLayout.jsx';
import useStorefront from '../../hooks/useStorefront.js';

export default function Storefront() {
  const store = useStorefront();
  return <StorefrontLayout store={store} />;
}
