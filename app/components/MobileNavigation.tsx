'use client';

import React, { useState } from 'react';
//import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MobileNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    closeMenu();
  };

  return (
    <nav className='md:hidden'>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? 'Close' : 'Menu'}
      </button>
      {isMenuOpen && (
        <ul>
          <li>
            <button onClick={() => handleNavigation('/dashboard/posts')}>
              Posts
            </button>
          </li>
          {/* Add other navigation items here */}
        </ul>
      )}
    </nav>
  );
};

export default MobileNavigation;
