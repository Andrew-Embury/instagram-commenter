'use client';

import React, { useState } from 'react';
import { fetchInstagramComments } from '@/app/lib/instagram';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import { Button } from '@/app/components/ui/button';

interface LoadMoreCommentsProps {
  postId: string;
  postCaption: string;
  initialNextCursor: string;
  onPostAIReply: (
    commentId: string,
    parentId: string | null,
    editedReply: string
  ) => Promise<void>;
}

const LoadMoreComments: React.FC<LoadMoreCommentsProps> = ({
  postId,
  postCaption,
  initialNextCursor,
  onPostAIReply,
}) => {
  const [comments, setComments] = useState<InstagramComment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialNextCursor
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreComments = async () => {
    if (isLoading || !nextCursor) return;

    setIsLoading(true);
    try {
      const { comments: newComments, next } = await fetchInstagramComments(
        postId,
        nextCursor
      );
      setComments((prevComments) => [...prevComments, ...newComments]);
      setNextCursor(next);
    } catch (error) {
      console.error('Error fetching more comments:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {comments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          postId={postId}
          postCaption={postCaption}
          aiReply=''
          onPostAIReply={onPostAIReply}
        />
      ))}
      {nextCursor && (
        <Button
          onClick={loadMoreComments}
          disabled={isLoading}
          className='mt-4 w-full'
        >
          {isLoading ? 'Loading...' : 'Load More Comments'}
        </Button>
      )}
    </div>
  );
};

export default LoadMoreComments;
