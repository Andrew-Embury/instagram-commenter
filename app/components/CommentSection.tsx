'use client';

import React, { useState } from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';
import LoadMoreComments from '@/app/components/LoadMoreComments';
import { generateAIResponse, postAIResponse } from '@/app/lib/ai';

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

  const handleGenerateAllAIReplies = async () => {
    setIsGenerating(true);
    const newAiReplies: { [key: string]: string } = { ...aiReplies };
    const batchSize = 20; // Changed from 5 to 20

    for (let i = 0; i < comments.length; i += batchSize) {
      const batch = comments.slice(i, i + batchSize);
      const promises = batch.map((comment) =>
        generateAIResponse(comment.text, postCaption)
          .then((reply) => {
            newAiReplies[comment.id] = reply;
          })
          .catch((error) => {
            console.error(
              `Failed to generate AI reply for comment ${comment.id}:`,
              error
            );
          })
      );

      await Promise.all(promises);
      setAiReplies({ ...newAiReplies });

      // Add a delay between batches to avoid rate limiting
      if (i + batchSize < comments.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setIsGenerating(false);
  };

  const handlePostAIReply = async (commentId: string, editedReply: string) => {
    try {
      await postAIResponse(commentId, editedReply);
      // You might want to update the comments state here
    } catch (error) {
      console.error('Failed to post AI response:', error);
    }
  };

  const topLevelComments = comments.filter(
    (comment) =>
      !comments.some((c) => c.replies?.some((reply) => reply.id === comment.id))
  );

  const sortedTopLevelComments = topLevelComments.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div>
      <button
        onClick={handleGenerateAllAIReplies}
        disabled={isGenerating}
        className='mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'
      >
        {isGenerating ? 'Generating...' : 'Generate AI Replies'}
      </button>
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
