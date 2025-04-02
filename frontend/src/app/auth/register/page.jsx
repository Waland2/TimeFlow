'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/utils/auth';
import '@/styles/auth.css';
import Link from 'next/link'
import { useUser } from '@/context/UserContext';

export default function RegistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { user, setUser } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/cards")
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await register(email, password);
      setUser(res);
      router.push('/cards');
    }
    catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration error. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Registration</h2>
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

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Repeat your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="login-link">
          Already have an account? <Link href="/auth/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}
