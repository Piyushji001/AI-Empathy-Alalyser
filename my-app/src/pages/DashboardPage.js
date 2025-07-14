import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { Star, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { fetchInteractions } from '../api/api';
import '../styles/Dashboard.css';

const DashboardPage = () => {
    const [interactions, setInteractions] = useState([]);
    
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchInteractions();
            setInteractions(data);
        };
        loadData();
    }, []);

    const averageScore = 75;

    return (
        <div>
            <h1 className="page-title">Dashboard</h1>
            <div className="dashboard-grid">
                <StatCard icon={<Star />} title="Average Empathy Score" value={averageScore} color="#3B82F6"/>
                <StatCard icon={<MessageSquare />} title="Total Interactions" value={interactions.length} color="#10B981"/>
                <StatCard icon={<TrendingUp />} title="Weekly Improvement" value="+5%" color="#F59E0B"/>
                <StatCard icon={<Target />} title="Next Goal" value="85" color="#8B5CF6"/>
            </div>
            {/* You can add more dashboard components like charts here */}
        </div>
    );
};

export default DashboardPage;