import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
if (API_BASE) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = API_BASE + input;
    } else if (input instanceof Request && input.url.startsWith(window.location.origin + '/api')) {
      input = new Request(API_BASE + input.url.slice(window.location.origin.length), input);
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
