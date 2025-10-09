import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HashRouter as Router } from "react-router-dom";
import { UserProvider } from './context/UserContext.jsx';
import { CartProvider } from './context/CartProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </UserProvider>,
  </StrictMode>,
)
