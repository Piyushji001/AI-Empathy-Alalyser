import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api_login } from '../api/api';
import '../styles/Auth.css'; // CSS import karein

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await api_login(username, password);
        if (res.ok) {
            navigate('/');
        } else {
            setError(res.detail || 'Login failed!');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="form-input" required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
                    <button type="submit" className="form-button btn-login">Login</button>
                </form>
                <p className="auth-switch-text">
                    Don't have an account? <Link to="/signup"><button>Sign Up</button></Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;