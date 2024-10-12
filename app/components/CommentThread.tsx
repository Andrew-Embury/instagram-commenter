'use client';

import React from 'react';
import Comment from './Comment';
import AIReplyBox from './AIReplyBox';
import { InstagramComment } from '@/types/instagram';

interface CommentThreadProps {
  comment: InstagramComment;
  postId: string;
  postCaption: string;
  onPostAIReply: (commentId: string, editedReply: string) => Promise<void>;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  postId,
  postCaption,
  onPostAIReply,
}) => {
  const getCommentText = (comment: InstagramComment): string => {
    let text = comment.text;
    if (comment.replies && comment.replies.length > 0) {
      text += ' ' + comment.replies.map((reply) => reply.text).join(' ');
    }
    return text;
  };

  const renderReplies = (replies: InstagramComment[] | undefined) => {
    if (!replies || replies.length === 0) return null;

    // Sort replies by timestamp, oldest first
    const sortedReplies = [...replies].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedReplies.map((reply, index) => (
      <div key={reply.id} className='ml-8 mt-2'>
        <Comment comment={reply} />
        {index === sortedReplies.length - 1 && (
          <AIReplyBox
            initialReply=''
            onPost={(editedReply: string) =>
              onPostAIReply(reply.id, editedReply)
            }
            commentText={getCommentText(reply)}
            postCaption={postCaption}
            parentCommentId={reply.id}
          />
        )}
      </div>
    ));
  };

  return (
    <div className='comment-thread mb-4'>
      <Comment comment={comment} />
      {renderReplies(comment.replies)}
      {(!comment.replies || comment.replies.length === 0) && (
        <div className='ml-8 mt-2'>
          <AIReplyBox
            initialReply=''
            onPost={(editedReply: string) =>
              onPostAIReply(comment.id, editedReply)
            }
            commentText={getCommentText(comment)}
            postCaption={postCaption}
            parentCommentId={comment.id}
          />
        </div>
      )}
    </div>
  );
};

export default CommentThread;
