'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/auth.css';
import api from '@/lib/axios';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const url = new URL(window.location.href);
        const tokenFromUrl = url.searchParams.get('token');
        setToken(tokenFromUrl);
        if (tokenFromUrl === null) router.push("/");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setStatus('error');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await api.post('/auth/password-reset', {
                token,
                new_password: newPassword,
            });
            setStatus('success');
            setTimeout(() => router.push('/auth/login'), 2000);
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="form-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="new_password">New Password</label>
                    <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        placeholder="Enter your new password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Repeat your new password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Reset Password</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {status === 'success' && <p style={{ color: 'green' }}>Password updated! Redirecting...</p>}
                {status === 'error' && !error && (
                    <p style={{ color: 'red' }}>Token is invalid or expired.</p>
                )}
            </form>
        </div>
    );
}
