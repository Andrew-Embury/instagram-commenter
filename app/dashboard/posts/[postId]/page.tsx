import { fetchInstagramPost, fetchInstagramComments } from '@/lib/instagram';
import CommentsClient from '@/components/CommentsClient';
import AIRepliesClient from '@/components/AIRepliesClient';
import { Post } from '@/types/instagram';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Heart } from 'lucide-react';

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const post: Post = await fetchInstagramPost(params.postId);
  const comments = await fetchInstagramComments(params.postId);

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Post Details</h2>
      <Card>
        <CardContent className='p-0'>
          <div className='relative aspect-square w-full'>
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              style={{ objectFit: 'cover' }}
              className='rounded-t-lg'
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-between items-center p-4'>
          <p className='text-sm text-gray-500'>{post.caption}</p>
          <div className='flex space-x-4'>
            <span className='flex items-center'>
              <Heart className='w-4 h-4 mr-1' /> {post.likes}
            </span>
            <span className='flex items-center'>
              <MessageSquare className='w-4 h-4 mr-1' /> {post.comments}
            </span>
          </div>
        </CardFooter>
      </Card>

      <Tabs defaultValue='all-comments'>
        <TabsList>
          <TabsTrigger value='all-comments'>All Comments</TabsTrigger>
          <TabsTrigger value='ai-replies'>AI Replies</TabsTrigger>
        </TabsList>
        <TabsContent value='all-comments'>
          <CommentsClient initialComments={comments} postId={params.postId} />
        </TabsContent>
        <TabsContent value='ai-replies'>
          <AIRepliesClient initialComments={comments} postId={params.postId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
