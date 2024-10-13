'use client';

import React from 'react';
import Comment from './Comment';
import AIReplyBox from './AIReplyBox';
import { InstagramComment } from '@/types/instagram';
import { Card, CardContent } from '@/app/components/ui/card';

interface CommentThreadProps {
  comment: InstagramComment;
  postId: string;
  postCaption: string;
  aiReply: string;
  onPostAIReply: (
    commentId: string,
    parentId: string | null,
    editedReply: string
  ) => Promise<void>;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  aiReply,
  onPostAIReply,
}) => {
  const renderReplies = (replies: InstagramComment[] | undefined) => {
    if (!replies || replies.length === 0) return null;

    const sortedReplies = [...replies].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedReplies.map((reply, index) => (
      <div key={reply.id} className='ml-8 mt-4'>
        <Comment comment={reply} />
        {index === sortedReplies.length - 1 && (
          <AIReplyBox
            aiReply={aiReply}
            onPostReply={(editedReply) =>
              onPostAIReply(reply.id, comment.id, editedReply)
            }
          />
        )}
      </div>
    ));
  };

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-4 space-y-4'>
        <Comment comment={comment} />
        {(!comment.replies || comment.replies.length === 0) && (
          <AIReplyBox
            aiReply={aiReply}
            onPostReply={(editedReply) =>
              onPostAIReply(comment.id, null, editedReply)
            }
          />
        )}
        {renderReplies(comment.replies)}
      </CardContent>
    </Card>
  );
};

export default CommentThread;
