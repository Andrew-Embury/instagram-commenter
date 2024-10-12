'use client';

import React, { useState, useEffect } from 'react';
import { generateAIReply, postComment } from '../lib/api';

interface AIReplyBoxProps {
  postId: string;
  parentCommentId: string;
}

const AIReplyBox: React.FC<AIReplyBoxProps> = ({ postId, parentCommentId }) => {
  const [aiReply, setAiReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAIReply = async () => {
      setIsLoading(true);
      const reply = await generateAIReply(postId, parentCommentId);
      setAiReply(reply);
      setIsLoading(false);
    };

    fetchAIReply();
  }, [postId, parentCommentId]);

  const handlePostReply = async () => {
    await postComment(postId, parentCommentId, aiReply);
    // Optionally, you can add logic here to refresh the comments or update the UI
  };

  return (
    <div className='ai-reply-box'>
      {isLoading ? (
        <p>Generating AI reply...</p>
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
