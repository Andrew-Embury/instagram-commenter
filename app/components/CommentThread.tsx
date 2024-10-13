'use client';

import React from 'react';
import Comment from './Comment';
import AIReplyBox from './AIReplyBox';
import { InstagramComment } from '@/types/instagram';

interface CommentThreadProps {
  comment: InstagramComment;
  postId: string;
  postCaption: string;
  aiReply: string;
  onPostAIReply: (commentId: string, editedReply: string) => Promise<void>;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  postId,
  postCaption,
  aiReply,
  onPostAIReply,
}) => {
  const renderReplies = (replies: InstagramComment[] | undefined) => {
    if (!replies || replies.length === 0) return null;

    const sortedReplies = [...replies].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedReplies.map((reply) => (
      <div key={reply.id} className='ml-8 mt-2'>
        <Comment comment={reply} />
      </div>
    ));
  };

  return (
    <div className='comment-thread mb-4'>
      <Comment comment={comment} />
      {renderReplies(comment.replies)}
      <div className='ml-8 mt-2'>
        <AIReplyBox
          aiReply={aiReply}
          onPostReply={(editedReply: string) =>
            onPostAIReply(comment.id, editedReply)
          }
        />
      </div>
    </div>
  );
};

export default CommentThread;
