import '@/app/globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Property Listing App',
  description: 'Find your dream property!',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
            <head>
        {/* Link to Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
