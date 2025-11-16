import '../styles/globals.css';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (!mounted) return null;

  return <Component {...pageProps} />;
}
