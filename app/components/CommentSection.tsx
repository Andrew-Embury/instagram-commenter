'use client';

import React, { useState, useCallback } from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import LoadMoreComments from '@/app/components/LoadMoreComments';
import { generateAIResponse, postAIResponse } from '@/app/lib/ai';
import { Button } from '@/app/components/ui/button';
import { postReplyToInstagram } from '@/app/lib/instagram'; // You'll need to implement this function
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

    const generateRepliesForComment = async (comment: InstagramComment) => {
      if (
        !newAiReplies[comment.id] &&
        (!comment.replies || comment.replies.length === 0)
      ) {
        console.log(`Generating reply for comment: ${comment.id}`);
        const aiReply = await generateAIResponse(comment.text, postCaption);
        newAiReplies[comment.id] = aiReply;
        console.log(`Generated reply for comment: ${comment.id}`);
      } else {
        console.log(
          `Skipping generation for comment: ${comment.id} (already exists or has replies)`
        );
      }

      if (comment.replies && comment.replies.length > 0) {
        const lastReply = comment.replies[comment.replies.length - 1];
        if (!newAiReplies[lastReply.id]) {
          console.log(`Generating reply for nested comment: ${lastReply.id}`);
          const aiReply = await generateAIResponse(lastReply.text, postCaption);
          newAiReplies[lastReply.id] = aiReply;
          console.log(`Generated reply for nested comment: ${lastReply.id}`);
        } else {
          console.log(
            `Skipping generation for nested comment: ${lastReply.id} (already exists)`
          );
        }
      }
    };

    console.log('Starting to generate all AI replies');
    for (const comment of comments) {
      await generateRepliesForComment(comment);
    }
    console.log('Finished generating all AI replies');

    setAiReplies(newAiReplies);
    setIsGenerating(false);
  };

  const handlePostAIReply = useCallback(
    async (commentId: string, editedReply: string) => {
      try {
        const response = await fetch('/api/post-reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId, commentId, replyText: editedReply }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to post reply');
        }

        // Update local state to reflect the posted reply
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
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
                }
              : comment
          )
        );
        setIsSuccessModalOpen(true);
      } catch (error: unknown) {
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

  const topLevelComments = comments.filter(
    (comment) =>
      !comments.some((c) => c.replies?.some((reply) => reply.id === comment.id))
  );

  const sortedTopLevelComments = topLevelComments.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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
        {sortedTopLevelComments.map((comment) => (
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
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default React.memo(CommentSection);
