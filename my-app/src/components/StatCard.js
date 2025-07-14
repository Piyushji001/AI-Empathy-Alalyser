import React from 'react';
import '../styles/Dashboard.css'; // Import CSS

const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card">
    <div className="stat-card-icon" style={{ backgroundColor: color }}>{icon}</div>
    <div className="stat-card-info">
      <p className="title">{title}</p>
      <p className="value">{value}</p>
    </div>
  </div>
);

export default StatCard;