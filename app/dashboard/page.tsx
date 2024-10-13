import React from 'react';
import { fetchInstagramPosts } from '@/app/lib/instagram';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';
import Image from 'next/image';

export default async function DashboardPage() {
  const posts = await fetchInstagramPosts();

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>All Posts</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {posts.map((post) => (
          <Link href={`/dashboard/posts/${post.id}`} key={post.id}>
            <Card>
              <CardContent className='p-4'>
                <div className='relative aspect-square w-full mb-2'>
                  <Image
                    src={post.imageUrl}
                    alt={post.caption}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <p className='text-sm truncate'>{post.caption}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
