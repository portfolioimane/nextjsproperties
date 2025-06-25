'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer'; // 👈 import Footer

const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isOwner = pathname.startsWith('/owner');

  return (
    <>
      {!isAdmin && !isOwner && <Navbar />}
      {children}
      {!isAdmin && !isOwner && <Footer />} {/* 👈 Show footer if not admin/owner */}
    </>
  );
};

export default FrontendLayout;
