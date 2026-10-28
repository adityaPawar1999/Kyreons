import React from 'react';
import { createRoot } from 'react-dom/client';
import Storefront from './pages/storefront/Storefront.jsx';
import './styles/global.css';
import './styles/tailwind.css';
import './styles/react-overrides.css';
import './styles/catalog-redesign.css';
import './styles/header-collection.css';
import './styles/shirts-page.css';
import './styles/navigation-responsive.css';
import './styles/reviews.css';
import './styles/footer.css';
import './styles/contact.css';
import './styles/spotlight-gallery.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Storefront />
  </React.StrictMode>,
);
