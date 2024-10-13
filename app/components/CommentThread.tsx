'use client';

import React, { memo } from 'react';
import Comment from './Comment';
import AIReplyBox from './AIReplyBox';
import { InstagramComment } from '@/types/instagram';
import { Card, CardContent } from '@/app/components/ui/card';

interface CommentThreadProps {
  comment: InstagramComment;
  postId: string;
  postCaption: string;
  aiReplies: { [key: string]: string };
  onPostAIReply: (commentId: string, editedReply: string) => Promise<void>;
}

const CommentThread: React.FC<CommentThreadProps> = memo(
  ({ comment, postId, postCaption, aiReplies, onPostAIReply }) => {
    console.log(`Rendering CommentThread for comment: ${comment.id}`);

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
              aiReply={aiReplies[reply.id] || ''}
              onPostReply={(editedReply) =>
                onPostAIReply(reply.id, editedReply)
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
          {renderReplies(comment.replies)}
          {(!comment.replies || comment.replies.length === 0) && (
            <div className='mt-4'>
              <AIReplyBox
                aiReply={aiReplies[comment.id] || ''}
                onPostReply={(editedReply) =>
                  onPostAIReply(comment.id, editedReply)
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

CommentThread.displayName = 'CommentThread';

export default CommentThread;
