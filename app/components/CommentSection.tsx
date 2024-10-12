'use client';

import React, { useState } from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import { fetchInstagramComments } from '@/lib/instagram';

interface CommentSectionProps {
  initialComments: InstagramComment[];
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  initialComments,
  postId,
}) => {
  const [comments, setComments] = useState<InstagramComment[]>(initialComments);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
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

  const topLevelComments = comments.filter(
    (comment) =>
      !comments.some((c) => c.replies?.some((reply) => reply.id === comment.id))
  );

  const sortedTopLevelComments = topLevelComments.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div>
      {sortedTopLevelComments.map((comment) => (
        <CommentThread key={comment.id} comment={comment} postId={postId} />
      ))}
      {nextCursor && (
        <button
          onClick={loadMoreComments}
          disabled={isLoading}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'
        >
          {isLoading ? 'Loading...' : 'Load More Comments'}
        </button>
      )}
    </div>
  );
};

export default CommentSection;
