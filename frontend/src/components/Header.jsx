'use client';

import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfilePage() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes('cards')) {
            setActiveTab(1);
        } else if (pathname.includes('dashboard')) {
            setActiveTab(2);
        }
    }, [pathname]);

    return (
        <header className='no-select'>
            <div className='logo-and-nav'>
                <Link href="/" onClick={() => setActiveTab('cards')}>
                    <span className='logo'>TimeFlow</span>
                    <span className='logo-m'>TF</span>
                </Link>
                <div className='nav-icons'>
                    <Link href="/cards">
                        <span className={'nav-icon ' + (activeTab === 1 ? 'active' : '')}>
                            Cards
                        </span>
                    </Link>
                    <Link href="/dashboard">
                        <span className={'nav-icon ' + (activeTab === 2 ? 'active' : '')}>
                            Dashboard
                        </span>
                    </Link>
                </div>
            </div>

            <div className='user-panel'>
                {user === null ? (
                    <Link href="/auth/login">
                        <span className='login-btn'>Log In</span>
                    </Link>
                ) : (
                    <div className="user-wrapper">
                        <span className='user-email'>{user.email.split("@")[0]}</span>
                        <div className="logout-wrapper">
                            <Link href="/auth/logout">
                                <span className="logout-btn">Log Out</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
