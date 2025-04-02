'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { logout } from '@/utils/auth';

export default function LogoutPage() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const doLogout = async () => {
      await logout();         
      setUser(null);          
      router.push('/');       
    };

    doLogout();
  }, [router, setUser]);

  return null;
}