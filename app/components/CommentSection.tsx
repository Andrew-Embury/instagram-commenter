'use client';

import React, { useState, useCallback } from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import LoadMoreComments from '@/app/components/LoadMoreComments';
import { generateAIResponse } from '@/app/lib/ai';
import { Button } from '@/app/components/ui/button';
import SuccessModal from './SuccessModal';

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
  const [comments, setComments] = useState(initialComments);
  const [aiReplies, setAiReplies] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleGenerateAllAIReplies = async () => {
    setIsGenerating(true);
    const newAiReplies: { [key: string]: string } = { ...aiReplies };

    const generateForComment = async (comment: InstagramComment) => {
      if (!newAiReplies[comment.id]) {
        const aiReply = await generateAIResponse(comment.text, postCaption);
        newAiReplies[comment.id] = aiReply;
      }
      if (comment.replies) {
        for (const reply of comment.replies) {
          await generateForComment(reply);
        }
      }
    };

    for (const comment of comments) {
      await generateForComment(comment);
    }

    setAiReplies(newAiReplies);
    setIsGenerating(false);
  };

  const handlePostAIReply = useCallback(
    async (commentId: string, parentId: string | null, editedReply: string) => {
      try {
        const response = await fetch('/api/post-reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            commentId,
            parentId,
            replyText: editedReply,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to post reply');
        }

        // Update local state to reflect the posted reply
        setComments((prevComments) => {
          const updateComment = (
            comment: InstagramComment
          ): InstagramComment => {
            if (comment.id === (parentId || commentId)) {
              return {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  {
                    id: Date.now().toString(), // Temporary ID
                    text: editedReply,
                    username: 'Your Instagram Username', // Replace with actual username
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

        // Remove the posted reply from aiReplies
        setAiReplies((prev) => {
          const newAiReplies = { ...prev };
          delete newAiReplies[commentId];
          return newAiReplies;
        });

        setIsSuccessModalOpen(true);
      } catch (error) {
        console.error('Failed to post AI response:', error);
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
      }
    },
    [postId]
  );

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  // Filter out nested comments and sort top-level comments
  const topLevelComments = comments
    .filter(
      (comment) =>
        !comments.some((c) =>
          c.replies?.some((reply) => reply.id === comment.id)
        )
    )
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  return (
    <div className='space-y-6'>
      <Button
        onClick={handleGenerateAllAIReplies}
        disabled={isGenerating}
        className='w-full'
        variant={isGenerating ? 'outline' : 'default'}
      >
        {isGenerating ? 'Generating...' : 'Generate AI Replies'}
      </Button>
      <div className='space-y-6'>
        {topLevelComments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            postId={postId}
            postCaption={postCaption}
            aiReplies={aiReplies}
            onPostAIReply={handlePostAIReply}
          />
        ))}
      </div>
      {initialNextCursor && (
        <LoadMoreComments
          postId={postId}
          postCaption={postCaption}
          initialNextCursor={initialNextCursor}
          onPostAIReply={handlePostAIReply}
        />
      )}
      <SuccessModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />
    </div>
  );
};

export default React.memo(CommentSection);
