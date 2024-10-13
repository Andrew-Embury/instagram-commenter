import React from 'react';
import {
  fetchInstagramPost,
  fetchInstagramComments,
} from '@/app/lib/instagram';
import { Post } from '@/types/instagram';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

const CommentSection = dynamic(
  () => import('@/app/components/CommentSection'),
  {
    ssr: false,
  }
);

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  let post: Post;
  let initialComments;

  try {
    post = await fetchInstagramPost(params.postId);
    const { comments } = await fetchInstagramComments(params.postId);
    initialComments = comments;
  } catch (error) {
    console.error('Error fetching post or comments:', error);
    return <div>Error loading post. Please try again later.</div>;
  }

  if (!post || !post.imageUrl) {
    return <div>Post not found or media not available.</div>;
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Post Details</h2>
      <Card>
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
        </CardContent>
        <CardFooter className='flex justify-between items-center p-4'>
          <p className='text-sm text-gray-500'>{post.caption}</p>
          <div className='flex items-center'>
            <Heart className='w-4 h-4 mr-1' />
            {post.likes}
          </div>
        </CardFooter>
      </Card>

      <h2>Comments</h2>
      <CommentSection
        initialComments={initialComments}
        postId={params.postId}
        postCaption={post.caption}
      />
    </div>
  );
}
