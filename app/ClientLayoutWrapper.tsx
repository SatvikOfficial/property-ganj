'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { CityProvider } from '@/components/CityContext';
import StickyContact from '@/components/ui/stickysocials';
import Footer from '@/components/Footer';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show on 404 page
  const isNotFoundPage = pathname === '/not-found';

  // Hide common layout elements for builder dashboard
  const isBuilderDashboard = pathname === '/builder-dashboard' || pathname?.startsWith('/builder-dashboard/');

  return (
    <CityProvider>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <div className="flex-grow w-full">
          {children}
        </div>
        {!isNotFoundPage && !isBuilderDashboard && <Footer />}
      </div>
      {!isNotFoundPage && !isBuilderDashboard && <StickyContact />}
    </CityProvider>
  );
}
