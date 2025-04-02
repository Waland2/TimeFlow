import api from '@/lib/axios';
import Cookies from 'js-cookie';

export async function login(email, password) {
    const res = await api.post(`auth/login`, {
        email,
        password,
    });

    const token = res.data.access_token;

    Cookies.set('access_token', token, {
        expires: 90, // TODO change
        secure: true,
        sameSite: 'Lax',
    });

    return res.data;
}

export async function me() {
    const res = await api.get(`auth/me`);
    return res.data;
}


export async function register(email, password) {
    const res = await api.post(`auth/register`, {
        email,
        password,
    })
    const loginData = await login(email, password)
    return res.data;
}


export async function logout() {
    Cookies.remove('access_token');
}