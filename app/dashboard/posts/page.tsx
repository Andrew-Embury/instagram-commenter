import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';
import Image from 'next/image';
import { Post } from '@/types/instagram';

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/instagram-posts`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
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
  );
}
