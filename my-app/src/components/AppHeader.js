import React from 'react';
// CSS is imported in MainLayout.js, so no need to import here again

const AppHeader = ({ onLogout }) => (
  <header className="app-header">
    <h1>Empathy & Mentoring Platform</h1>
    <button onClick={onLogout} className="logout-button">Logout</button>
  </header>
);

export default AppHeader;