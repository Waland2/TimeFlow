'use client';

import { useState } from 'react';
import '@/styles/auth.css';
import api from '@/lib/axios';

export default function StartPasswordResetPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setError('');
    
        try {
            await api.post('/auth/start-password-reset', { email });
            setStatus('Reset link sent! Please check your inbox — the email may be in your spam folder.');
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No user found with this email address.');
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };
    
    

    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Enter your email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit">Send Reset Link</button>
                {status && <p style={{ color: 'green' }}>{status}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}
