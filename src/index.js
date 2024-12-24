import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Optional: Your global styles
import AuthApp from './AuthApp';
import App from './App';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import SweetAlert2 CSS (for styles)
import 'sweetalert2/dist/sweetalert2.min.css';

// Create a root element for rendering the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
const isAuthenticated = localStorage.getItem('token');

// Render the App component into the root element
root.render(
  <React.StrictMode>
     {isAuthenticated ? <App /> : <AuthApp />}
  </React.StrictMode>
);
