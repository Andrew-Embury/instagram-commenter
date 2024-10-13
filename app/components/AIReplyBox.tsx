'use client';

import React, { useState, useEffect } from 'react';
import { generateAIResponse, postAIResponse } from '@/app/lib/ai';

interface AIReplyBoxProps {
  initialReply: string;
  onPost: (editedReply: string) => void;
  commentText: string;
  postCaption: string;
  parentCommentId?: string;
}

const AIReplyBox: React.FC<AIReplyBoxProps> = ({
  initialReply,
  onPost,
  commentText,
  postCaption,
  parentCommentId,
}) => {
  console.log('AIReplyBox received postCaption:', postCaption); // Add this line

  const [aiReply, setAiReply] = useState(initialReply);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIReply = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const reply = await generateAIResponse(commentText, postCaption);
        console.log('AI Reply received:', reply);
        setAiReply(reply);
      } catch (err) {
        console.error('Error fetching AI reply:', err);
        setError('Failed to generate AI reply');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIReply();
  }, [commentText, postCaption]);

  const handlePostReply = async () => {
    try {
      await postAIResponse(parentCommentId || '', aiReply);
      onPost(aiReply);
    } catch (err) {
      console.error('Error posting AI reply:', err);
      setError('Failed to post AI reply');
    }
  };

  return (
    <div className='ai-reply-box'>
      {isLoading ? (
        <p>Generating AI reply...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <>
          <textarea
            value={aiReply}
            onChange={(e) => setAiReply(e.target.value)}
            rows={4}
            className='w-full p-2 border rounded'
          />
          <button
            onClick={handlePostReply}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Post Reply
          </button>
        </>
      )}
    </div>
  );
};

export default AIReplyBox;
