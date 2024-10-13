import { Inter } from 'next/font/google';
import './globals.css';
import DashboardLayout from '@/app/components/DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Instagram Dashboard',
  description: 'Manage your Instagram posts and comments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
