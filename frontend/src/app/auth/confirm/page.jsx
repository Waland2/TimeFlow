'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/auth.css';
import api from '@/lib/axios';

export default function ConfirmEmailPage() {
    const router = useRouter();
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');

        const confirm = async () => {
            if (!token) {
                setStatus('info');
                return;
            }

            try {
                await api.post('/auth/confirm-email', { token });
                setStatus('success');
                setTimeout(() => router.push('/cards'), 2000);
            } catch (error) {
                setStatus('error');
            }
        };

        confirm();
    }, [router]);

    return (
        <div className="form-container">
            <h2>Email Confirmation</h2>

            {status === 'info' && (
                <div className="info-block">
                    <p>
                        To confirm your account, please click the link we sent to your email.
                        If you don’t see the message, check your spam or junk folder.
                    </p>
                    <button className="info-button" onClick={() => router.push('/cards')}>
                        I Understand
                    </button>
                </div>
            )}


            {status === 'pending' && <p>Confirming your email...</p>}

            {status === 'success' && (
                <p style={{ color: 'green' }}>
                    Email confirmed! Redirecting to login...
                </p>
            )}

            {status === 'error' && (
                <p style={{ color: 'red' }}>
                    Invalid or expired token.
                </p>
            )}
        </div>
    );
}
