// app/components/FrontendLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/frontend/Navbar';

const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isOwner = pathname.startsWith('/owner');


  return (
    <>
      {!isAdmin && !isOwner && <Navbar />}
      {children}
    </>
  );
};

export default FrontendLayout;
