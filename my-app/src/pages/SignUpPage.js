import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api_register } from '../api/api';
import '../styles/Auth.css'; // CSS import karein

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        try {
            const res = await api_register(username, password);
            if (res.ok) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const data = await res.json();
                setError(data.detail || 'Registration failed!');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        className="form-input" 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="form-input" 
                        required 
                    />
                    <button type="submit" className="form-button btn-signup">Sign Up</button>
                </form>
                <p className="auth-switch-text">
                    Already have an account? <Link to="/login"><button>Login</button></Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;