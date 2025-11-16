import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get first app and redirect
    const storedApps = localStorage.getItem('apps');
    if (storedApps) {
      const apps = JSON.parse(storedApps);
      if (apps.length > 0) {
        router.push(`/apps/${apps[0].id}`);
        return;
      }
    }

    // If no apps, stay on home
    router.push('/settings');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    </div>
  );
}
