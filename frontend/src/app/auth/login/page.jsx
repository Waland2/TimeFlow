'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, me } from '@/utils/auth';
import Link from 'next/link'
import '@/styles/auth.css';
import { updateUser, useUser } from '@/context/UserContext';

export default function LoginPage() {


    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {user, setUser} = useUser();

    useEffect(() => {
        if (user) {
            router.push("/cards")
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resLogin = await login(email, password);
            const resMe = await me();
            setUser(resMe);
            router.push('/cards');
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Login error: check your email and password');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Log In</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="login-link">
                    Don't have an account? <Link href="/auth/register">Register</Link>
                </div>
                <div className="login-link">
                    Forgot password? <Link href="/auth/start-reset">Reset it</Link>
                </div>
            </form>
        </div>
    );
}
