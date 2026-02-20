'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/sidebar';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Rutas donde NO se debe mostrar el sidebar
  const noSidebarRoutes = ['/auth', '/auth/login', '/auth/register'];
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <div className="flex">
      {shouldShowSidebar && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

