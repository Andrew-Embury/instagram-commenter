'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='md:hidden'>
      <div className='bg-gray-800 py-2 px-4 flex items-center justify-between'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-gray-300 hover:text-white'
        >
          <Menu size={24} />
        </button>
      </div>
      {isOpen && (
        <div className='bg-gray-800 py-2 px-4'>
          <nav className='space-y-1'>
            <Link
              href='/dashboard'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              Dashboard
            </Link>
            <Link
              href='/dashboard/posts'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              Posts
            </Link>
            {/* Add more navigation items as needed */}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
