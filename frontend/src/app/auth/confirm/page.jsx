'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/auth.css';
import api from '@/lib/axios';

export default function ConfirmEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('pending');
    const token = searchParams.get('token');

    useEffect(() => {
        const confirm = async () => {
            try {
                await api.post('/auth/confirm-email', { token });
                setStatus('success');
                setTimeout(() => router.push('/cards'), 2000);
            } catch (error) {
                setStatus('error');
            }
        };

        if (token) confirm();
    }, [token, router]);

    return (
        <div className="form-container">
            <h2>Email Confirmation</h2>
            {status === 'pending' && <p>Confirming your email...</p>}
            {status === 'success' && <p style={{ color: 'green' }}>Email confirmed! Redirecting to login...</p>}
            {status === 'error' && <p style={{ color: 'red' }}>Invalid or expired token.</p>}
        </div>
    );
}
