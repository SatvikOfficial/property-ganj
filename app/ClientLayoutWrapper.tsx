'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import StickyContact from '@/components/ui/stickysocials';
import Footer from '@/components/Footer';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show on 404 page
  const isNotFoundPage = pathname === '/not-found';

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        {!isNotFoundPage && <Footer />}
      </div>
      {!isNotFoundPage && <StickyContact />}
    </>
  );
}