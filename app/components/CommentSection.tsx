'use client';

import React from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import LoadMoreComments from '@/app/components/LoadMoreComments';
import { postAIResponse } from '@/app/lib/ai';
import {
  fetchInstagramPost,
  fetchInstagramComments,
} from '@/app/lib/instagram';

interface CommentSectionProps {
  initialComments: InstagramComment[];
  postId: string;
  postCaption: string;
  initialNextCursor?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  initialComments,
  postId,
  postCaption,
  initialNextCursor,
}) => {
  console.log('CommentSection props:', {
    postId,
    postCaption,
    initialNextCursor,
  });

  const handlePostAIReply = async (commentId: string, editedReply: string) => {
    try {
      await postAIResponse(commentId, editedReply);
      console.log('AI reply posted successfully');
      // You might want to update the comments state here
    } catch (error) {
      console.error('Failed to post AI response:', error);
    }
  };

  const topLevelComments = initialComments.filter(
    (comment) =>
      !initialComments.some((c) =>
        c.replies?.some((reply) => reply.id === comment.id)
      )
  );

  const sortedTopLevelComments = topLevelComments.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div>
      {sortedTopLevelComments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          postId={postId}
          postCaption={postCaption}
          onPostAIReply={handlePostAIReply}
        />
      ))}
      {initialNextCursor && (
        <LoadMoreComments
          postId={postId}
          postCaption={postCaption}
          initialNextCursor={initialNextCursor}
          onPostAIReply={handlePostAIReply}
        />
      )}
    </div>
  );
};

export default CommentSection;
