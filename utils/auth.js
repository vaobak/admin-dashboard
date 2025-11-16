import Cookies from 'js-cookie';

const AUTH_COOKIE = 'admin_auth';
const CREDS_KEY = 'admin_credentials';

export const getStoredCredentials = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CREDS_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setStoredCredentials = (username, password) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CREDS_KEY, JSON.stringify({ username, password }));
};

export const getDefaultCredentials = () => {
  return {
    username: process.env.NEXT_PUBLIC_ADMIN_USER || 'rdx',
    password: process.env.NEXT_PUBLIC_ADMIN_PASS || '@Dev2025'
  };
};

export const getCurrentCredentials = () => {
  const stored = getStoredCredentials();
  return stored || getDefaultCredentials();
};

export const login = (username, password) => {
  const creds = getCurrentCredentials();
  if (username === creds.username && password === creds.password) {
    Cookies.set(AUTH_COOKIE, 'true', { expires: 7 });
    return true;
  }
  return false;
};

export const logout = () => {
  Cookies.remove(AUTH_COOKIE);
};

export const isAuthenticated = () => {
  return Cookies.get(AUTH_COOKIE) === 'true';
};

export const requireAuth = (context) => {
  const isAuth = context.req.cookies[AUTH_COOKIE] === 'true';
  if (!isAuth) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
};
