import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className='hidden md:flex md:flex-shrink-0'>
      <div className='flex flex-col w-64'>
        <div className='flex flex-col h-0 flex-1 bg-gray-800'>
          <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
            <nav className='mt-5 flex-1 px-2 bg-gray-800 space-y-1'>
              <Link
                href='/dashboard/posts'
                className='text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              >
                All Posts
              </Link>
              {/* Add more navigation items as needed */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
