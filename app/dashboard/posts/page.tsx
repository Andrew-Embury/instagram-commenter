import React from 'react';
import { fetchInstagramPosts } from '@/app/lib/instagram';
import { Post } from '@/types/instagram';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default async function PostsPage() {
  const posts: Post[] = await fetchInstagramPosts();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {posts.map((post) => (
        <Link href={`/dashboard/posts/${post.id}`} key={post.id}>
          <Card className='overflow-hidden'>
            <CardContent className='p-0'>
              <div className='relative aspect-square'>
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between items-center p-2'>
              <p className='text-sm text-gray-500 truncate'>{post.caption}</p>
              <div className='flex items-center'>
                <Heart className='w-4 h-4 mr-1' />
                {post.likes}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
