'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/auth.css';
import api from '@/lib/axios';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('');
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/password-reset', { token, new_password: newPassword });
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
                <button type="submit">Reset Password</button>
                {status === 'success' && <p style={{ color: 'green' }}>Password updated! Redirecting...</p>}
                {status === 'error' && <p style={{ color: 'red' }}>Token is invalid or expired.</p>}
            </form>
        </div>
    );
}
