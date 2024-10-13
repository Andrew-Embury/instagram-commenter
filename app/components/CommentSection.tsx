'use client';

import React, { useState } from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import { Button } from '@/app/components/ui/button';
import SuccessModal from './SuccessModal';
import ConfirmationDialog from './ConfirmationDialog';
//import { postAIResponse } from '@/app/lib/ai';
//import { postReplyToInstagram } from '@/app/lib/instagram';

interface CommentSectionProps {
  initialComments: InstagramComment[];
  postId: string;
  postCaption: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  initialComments,
  postId,
  postCaption,
}) => {
  const [comments, setComments] = useState<InstagramComment[]>(initialComments);
  const [aiReplies, setAiReplies] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingReply, setPendingReply] = useState<{
    commentId: string;
    parentId: string | null;
    editedReply: string;
  } | null>(null);

  const handleGenerateAllAIReplies = async () => {
    setIsGenerating(true);
    const newAiReplies: { [key: string]: string } = { ...aiReplies };

    for (const comment of comments) {
      try {
        const response = await fetch('/api/generate-ai-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: comment.text, caption: postCaption }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate AI response');
        }

        const data = await response.json();
        newAiReplies[comment.id] = data.reply;
      } catch (error) {
        console.error('Error generating AI reply:', error);
      }
    }

    setAiReplies(newAiReplies);
    setIsGenerating(false);
  };

  const handleRefreshComments = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/refresh-comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to refresh comments');
      }
      const refreshedComments = await response.json();
      setComments(refreshedComments);
    } catch (error) {
      console.error('Error refreshing comments:', error);
      alert('Failed to refresh comments. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePostAIReply = async (
    commentId: string,
    parentId: string | null,
    editedReply: string
  ) => {
    setPendingReply({ commentId, parentId, editedReply });
    setIsConfirmationOpen(true);
  };

  const confirmPostReply = async () => {
    setIsConfirmationOpen(false);
    if (!pendingReply) return;

    const { commentId, parentId, editedReply } = pendingReply;

    try {
      const response = await fetch('/api/post-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, commentId, replyText: editedReply }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      setComments((prevComments) => {
        const updateComment = (comment: InstagramComment): InstagramComment => {
          if (comment.id === (parentId || commentId)) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: Date.now().toString(),
                  text: editedReply,
                  username: 'AI Assistant',
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(updateComment),
            };
          }
          return comment;
        };

        return prevComments.map(updateComment);
      });

      setAiReplies((prev) => {
        const newAiReplies = { ...prev };
        delete newAiReplies[commentId];
        return newAiReplies;
      });

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Failed to post AI response:', error);
      alert('Failed to post reply. Please try again.');
    }

    setPendingReply(null);
  };

  const cancelPostReply = () => {
    setIsConfirmationOpen(false);
    setPendingReply(null);
  };

  const topLevelComments = comments.filter(
    (comment) =>
      !comments.some((c) => c.replies?.some((reply) => reply.id === comment.id))
  );

  const sortedTopLevelComments = [...topLevelComments].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className='space-y-6'>
      <div className='flex space-x-4'>
        <Button
          onClick={handleGenerateAllAIReplies}
          disabled={isGenerating}
          className='flex-1'
        >
          {isGenerating ? 'Generating...' : 'Generate AI Replies'}
        </Button>
        <Button
          onClick={handleRefreshComments}
          disabled={isRefreshing}
          className='flex-1'
          variant='outline'
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Comments'}
        </Button>
      </div>
      <div className='space-y-6'>
        {sortedTopLevelComments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            postId={postId}
            postCaption={postCaption}
            aiReply={aiReplies[comment.id] || ''}
            onPostAIReply={handlePostAIReply}
          />
        ))}
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onConfirm={confirmPostReply}
        onCancel={cancelPostReply}
      />
    </div>
  );
};

export default CommentSection;
