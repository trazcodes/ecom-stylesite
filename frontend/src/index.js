import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { SearchProvider } from './components/context/search';
import { CartProvider } from './components/context/cart';
import { initTheme } from './utils/theme';

// Initialize theme before rendering begins
initTheme();

// Import Font Awesome CSS here

const root = createRoot(document.getElementById('root'));
root.render(
    <SearchProvider>
        <CartProvider>
            <App />
        </CartProvider>
    </SearchProvider>
);

reportWebVitals();
