// app/components/FrontendLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
    </>
  );
};

export default FrontendLayout;
