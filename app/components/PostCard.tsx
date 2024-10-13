'use client';

import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import Image from 'next/image';
import { MessageSquare, Heart } from 'lucide-react';
import { Post } from '@/types/instagram';
import Link from 'next/link';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/dashboard/posts/${post.id}`}>
      <Card
        key={post.id}
        className='hover:shadow-lg transition-shadow duration-200'
      >
        <CardContent className='p-0'>
          <div className='relative aspect-square w-full'>
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              style={{ objectFit: 'cover' }}
              className='rounded-t-lg'
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'; // Replace with your placeholder image
              }}
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-between items-center p-4'>
          <div className='flex space-x-4'>
            <span className='flex items-center'>
              <Heart className='w-4 h-4 mr-1' /> {post.likes}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
