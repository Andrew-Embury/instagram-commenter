'use client';

import React from 'react';
import Comment from './Comment';
import AIReplyBox from './AIReplyBox';
import { InstagramComment } from '@/types/instagram';

interface CommentThreadProps {
  comment: InstagramComment;
  replies: InstagramComment[];
  postId: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  replies,
  postId,
}) => {
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const renderReplies = (replyComments: InstagramComment[]) => {
    return replyComments.map((reply) => (
      <div key={reply.id} className='ml-8 mt-2'>
        <Comment comment={reply} />
        {reply.replies &&
          reply.replies.length > 0 &&
          renderReplies(reply.replies)}
      </div>
    ));
  };

  return (
    <div className='comment-thread mb-4'>
      <Comment comment={comment} />
      {renderReplies(sortedReplies)}
      <div className='ml-8 mt-2'>
        <AIReplyBox
          postId={postId}
          parentCommentId={
            sortedReplies.length > 0
              ? sortedReplies[sortedReplies.length - 1].id
              : comment.id
          }
        />
      </div>
    </div>
  );
};

export default CommentThread;
