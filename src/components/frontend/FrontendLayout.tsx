'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';

const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isOwner = pathname.startsWith('/owner');

  // Wrap with flex-col and min-h-screen to push footer down if content is short
  return (
    <>
      {!isAdmin && !isOwner ? (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  );
};

export default FrontendLayout;
