'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import StickyContact from '@/components/ui/stickysocials';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show on 404 page
  const isNotFoundPage = pathname === '/not-found';

  return (
    <>
      <div className="pb-32 md:pb-0">
        {children}
      </div>
      {!isNotFoundPage && <StickyContact />}
    </>
  );
}