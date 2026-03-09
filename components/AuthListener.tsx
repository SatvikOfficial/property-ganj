'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * This component listens for auth changes and refreshes the page
 * when needed to ensure user state is properly synced
 */
export function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Listen for storage changes (auth state changes from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-changed') {
        // Refresh the current route to update user state
        router.refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  useEffect(() => {
    // If we're on the auth page and we just logged in, wait a moment and then
    // check if we should navigate away
    if (pathname === '/auth') {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            // User is authenticated, they should have been redirected already
            // but if not, redirect to home
            const data = await response.json();
            if (data.user) {
              // Use a slight delay to allow any page redirects to complete
              setTimeout(() => {
                window.location.href = '/';
              }, 500);
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      };

      // Check auth after component mounts
      const timeout = setTimeout(checkAuth, 1000);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return null;
}
