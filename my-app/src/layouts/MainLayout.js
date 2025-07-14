import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import { api_logout, fetchInteractions } from '../api/api';
import '../styles/Layout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const [interactions, setInteractions] = useState([]);

  // Function to fetch/refresh interactions
  const refreshInteractions = async () => {
    const data = await fetchInteractions();
    setInteractions(data);
  };

  // Fetch interactions when the layout mounts
  useEffect(() => {
    refreshInteractions();
  }, []);

  const handleLogout = () => {
    api_logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <AppHeader onLogout={handleLogout} />
      <div className="main-layout">
        {/* Pass interactions data to Sidebar */}
        <Sidebar interactions={interactions} />
        <main className="main-content">
          {/* Pass the refresh function to child pages (AddInteractionPage, etc.) */}
          <Outlet context={{ refreshInteractions }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;