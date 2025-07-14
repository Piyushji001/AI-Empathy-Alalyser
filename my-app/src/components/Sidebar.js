import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle } from 'lucide-react';
import RecentInteractionsList from './RecentInteractionsList';
// CSS is imported in MainLayout.js

// Sidebar now receives interactions as a prop
const Sidebar = ({ interactions }) => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-nav-list">
        <li>
          <NavLink to="/" className="sidebar-nav-link">
            <Home /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/add" className="sidebar-nav-link">
            <PlusCircle /> Add Interaction
          </NavLink>
        </li>
      </ul>
      <div className="recent-interactions-container">
        {/* Pass the received interactions to the list component */}
        <RecentInteractionsList interactions={interactions} />
      </div>
    </nav>
  );
};

export default Sidebar;