'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get('access_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setIsLoading(false);
          return setUser(res.data)
        })
        .catch(() => {
          setIsLoading(false);

          return setUser(null)
        });
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {

    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          Cookies.remove('access_token');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
