// app/layout.tsx
import '@/app/globals.css';
import { Providers } from '@/components/Providers';
import FrontendLayout from '@/components/frontend/FrontendLayout';

export const metadata = {
  title: 'Property Listing App',
  description: 'Find your dream property!',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <FrontendLayout>{children}</FrontendLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
