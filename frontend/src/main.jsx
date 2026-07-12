import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import Bootstrap 5 CSS, Bootstrap Icons, and core JS engine
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Custom Enterprise ERP styles
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
