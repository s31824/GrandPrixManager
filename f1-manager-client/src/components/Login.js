import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFillDemo = () => {
        setFormData({
            email: process.env.REACT_APP_DEMO_EMAIL,
            password: process.env.REACT_APP_DEMO_PASSWORD
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('https://f1-manager-api.onrender.com/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed.');

            auth.login(data.userId, data.token, data.role, data.teamId);

            if (data.role === 'admin') {
                navigate('/admin');
            } else if (data.role === 'team_principal' && data.teamId) {
                navigate(`/team/${data.teamId}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="f1-container">
            <h2>Paddock Access</h2>
            <div className="auth-card">
                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        name="email"
                        type="email"
                        placeholder="E-Mail Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="race-input"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="race-input"
                        required
                    />
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="btn-add-result">
                        ENTER PADDOCK
                    </button>
                </form>

                <div className="demo-section">
                    <p className="demo-title">Demo Access</p>
                    <p className="demo-text">Click to auto-fill admin credentials</p>
                    <button
                        type="button"
                        onClick={handleFillDemo}
                        className="btn-demo-fill"
                    >
                        USE ADMIN ACCOUNT
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;