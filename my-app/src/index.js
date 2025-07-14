import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css'; // index.css ko global.css se badal dein
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
