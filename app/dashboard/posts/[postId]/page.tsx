import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/app/components/ui/card';
import { Heart } from 'lucide-react';
import CommentSection from '@/app/components/CommentSection';
import { Post } from '@/types/instagram';
import { fetchInstagramComments } from '@/app/lib/instagram';

export const dynamic = 'force-dynamic';

async function getPost(postId: string): Promise<Post> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/instagram-posts/${postId}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPost(params.postId);
  const { comments } = await fetchInstagramComments(params.postId);

  if (!post || !post.imageUrl) {
    return <div>Post not found or media not available.</div>;
  }

  return (
    <div className='space-y-8 max-w-4xl mx-auto'>
      <h2 className='text-3xl font-bold text-gray-800'>Post Details</h2>
      <div className='space-y-4'>
        <Card className='overflow-hidden shadow-lg'>
          <CardContent className='p-0'>
            <div className='relative aspect-square w-full'>
              <Image
                src={post.imageUrl}
                alt={post.caption || 'Instagram post'}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                style={{ objectFit: 'cover' }}
                className='rounded-t-lg'
              />
            </div>
            <div className='flex justify-between items-center p-4 bg-gray-50'>
              <p className='text-sm text-gray-600'>{post.timestamp}</p>
              <div className='flex items-center text-pink-500'>
                <Heart className='w-5 h-5 mr-1 fill-current' />
                <span>{post.likes}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className='text-lg text-gray-700'>{post.caption}</p>
      </div>

      <h3 className='text-2xl font-semibold text-gray-800'>Comments</h3>
      <CommentSection
        initialComments={comments}
        postId={params.postId}
        postCaption={post.caption}
      />
    </div>
  );
}
