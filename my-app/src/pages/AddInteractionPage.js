import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; // Import useOutletContext
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { addInteraction } from '../api/api';
import '../styles/Interaction.css';

const AddInteractionPage = () => {
    const [studentName, setStudentName] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { text, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const navigate = useNavigate();
    const { refreshInteractions } = useOutletContext(); // Get the refresh function from MainLayout

    useEffect(() => {
        if (text) {
            setTranscript(prev => prev + text);
        }
    }, [text]);

    const handleSave = async () => {
        if (!studentName || !transcript) {
            alert("Please fill in student name and transcript.");
            return;
        }
        setIsLoading(true);
        const transcriptArray = transcript.split('\n').filter(line => line.trim() !== '').map(line => ({
            speaker: line.toLowerCase().startsWith('teacher:') ? 'Teacher' : 'Student',
            text: line.replace(/^(teacher:|student:)\s*/i, '')
        }));

        try {
            const newInteraction = await addInteraction({ studentName, transcript: transcriptArray });
            await refreshInteractions(); // <-- IMPORTANT: Refresh the list in the sidebar
            setIsLoading(false);
            navigate(`/analysis/${newInteraction._id}`);
        } catch (error) {
            setIsLoading(false);
            alert("Failed to save interaction.");
        }
    };

    return (
        <div className="interaction-page-container">
            <h2 className="page-title">Add New Interaction</h2>
            <div className="card">
                <div className="add-interaction-form">
                    <input 
                        type="text" 
                        placeholder="Student Name" 
                        value={studentName} 
                        onChange={e => setStudentName(e.target.value)} 
                        className="form-input"
                    />
                    <textarea 
                        placeholder="Type or record the conversation here. e.g.,&#10;Teacher: How are you?&#10;Student: I am fine." 
                        value={transcript} 
                        onChange={e => setTranscript(e.target.value)}
                        className="form-input"
                    ></textarea>
                    <div className="add-interaction-actions">
                        {hasRecognitionSupport && (
                            <button 
                                onClick={isListening ? stopListening : startListening}
                                className={`record-button ${isListening ? 'is-listening' : ''}`}
                            >
                                {isListening ? <MicOff /> : <Mic />}
                                {isListening ? 'Stop Recording' : 'Start Recording'}
                            </button>
                        )}
                        <button 
                            onClick={handleSave} 
                            disabled={isLoading}
                            className="save-button"
                        >
                            {isLoading && <Loader2 style={{animation: 'spin 1s linear infinite'}} />}
                            Save & Analyze
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInteractionPage;