'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, Image as ImageIcon, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type NavLinkProps = {
  icon: ReactNode;
  children: ReactNode;
  href: string;
  onClick: () => void;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const NavLink = ({ icon, children, href, onClick }: NavLinkProps) => (
    <Link
      href={href}
      className={`flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200 ${
        pathname === href ? 'bg-gray-200' : ''
      }`}
      onClick={() => {
        onClick();
        setIsOpen(false);
      }}
    >
      {icon}
      {children}
    </Link>
  );

  const Navigation = () => (
    <nav>
      <h2 className='mb-4 text-xl font-bold'>Dashboard</h2>
      <ul className='space-y-2'>
        <li>
          <NavLink
            href='/dashboard'
            icon={<ImageIcon className='mr-2 h-5 w-5' />}
            onClick={() => router.push('/dashboard')}
          >
            All Posts
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className='flex w-full items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200'
          >
            <LogOut className='mr-2 h-5 w-5' />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar for larger screens */}
      <aside className='hidden w-64 bg-white p-4 shadow-md lg:block'>
        <Navigation />
      </aside>

      {/* Main content */}
      <main className='flex flex-1 flex-col'>
        {/* Header */}
        <header className='bg-white p-4 shadow-md lg:hidden'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold'>Dashboard</h1>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-64 p-4'>
                <Navigation />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Page content */}
        <div className='flex-1 overflow-auto p-4'>{children}</div>
      </main>
    </div>
  );
}
