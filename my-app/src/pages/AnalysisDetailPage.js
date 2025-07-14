import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Award } from 'lucide-react';
import { fetchInteractions, analyzeInteraction } from '../api/api';
import '../styles/Interaction.css';

const AnalysisDetailPage = () => {
    const { id } = useParams();
    const [interaction, setInteraction] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setIsLoading(true);
            const allInteractions = await fetchInteractions();
            const currentInteraction = allInteractions.find(i => i.id === id);
            setInteraction(currentInteraction);

            if (currentInteraction) {
                const analysisData = await analyzeInteraction(id);
                setAnalysis(analysisData);
            }
            setIsLoading(false);
        };
        loadData();
    }, [id]);

    if (isLoading) {
        return <div className="interaction-page-container" style={{textAlign: 'center'}}><Loader2 style={{animation: 'spin 1s linear infinite', margin: 'auto', width: '2rem', height: '2rem'}}/></div>;
    }

    if (!interaction || !analysis) {
        return <div className="interaction-page-container"><p>Could not load analysis data for this interaction.</p></div>
    }

    return (
        <div className="interaction-page-container">
            <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
            <div className="card">
                <div className="analysis-header">
                    <div>
                        <h2 className="page-title" style={{marginBottom: 0}}>Interaction Analysis</h2>
                        <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Student: {interaction.studentName}</p>
                    </div>
                    <div className="score-display">
                        <p>Overall Empathy Score</p>
                        <p className="score">{analysis.overallEmpathyScore}</p>
                    </div>
                </div>
            </div>
            <div className="analysis-grid">
                <div className="card">
                    <h3 className="page-title" style={{fontSize: '1.25rem'}}>Conversation Transcript</h3>
                    <div className="transcript-container">
                        {interaction.transcript.map((line, index) => (
                            <div key={index} className={`transcript-line ${line.speaker.toLowerCase()}`}>
                                <p className="speaker">{line.speaker}</p>
                                <p className="text">{line.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h3 className="page-title" style={{fontSize: '1.25rem'}}>Actionable Feedback</h3>
                    <ul className="feedback-list">
                        {analysis.feedback.map((tip, index) => (
                            <li key={index} className="feedback-list-item">
                                <Award />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDetailPage;
