'use client';

import React from 'react';
import Comment from './Comment';
import AIReplyBox from './AIReplyBox';
import { InstagramComment } from '@/types/instagram';

interface CommentThreadProps {
  comment: InstagramComment;
  postId: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({ comment, postId }) => {
  const renderReplies = (replies: InstagramComment[] | undefined) => {
    if (!replies || replies.length === 0) return null;

    return replies.map((reply) => (
      <div key={reply.id} className='ml-8 mt-2'>
        <Comment comment={reply} />
        {renderReplies(reply.replies)}
      </div>
    ));
  };

  return (
    <div className='comment-thread mb-4'>
      <Comment comment={comment} />
      {renderReplies(comment.replies)}
      <div className='ml-8 mt-2'>
        <AIReplyBox postId={postId} parentCommentId={comment.id} />
      </div>
    </div>
  );
};

export default CommentThread;
