'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/types/instagram';
import { Card, CardContent } from '@/app/components/ui/card';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className='space-y-2'>
      <Link href={`/dashboard/posts/${post.id}`}>
        <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <Image
              src={post.imageUrl}
              alt='Instagram post'
              className='w-full h-64 object-cover mb-4'
            />
            <p className='text-xs text-gray-500'>Likes: {post.likes}</p>
          </CardContent>
        </Card>
      </Link>
      <p className='text-sm text-gray-600'>{post.caption}</p>
    </div>
  );
};

export default PostCard;
