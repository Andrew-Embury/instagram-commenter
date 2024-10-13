'use client';

import React, { useState, useEffect } from 'react';

interface AIReplyBoxProps {
  aiReply: string;
  onPostReply: (editedReply: string) => void;
}

const AIReplyBox: React.FC<AIReplyBoxProps> = ({ aiReply, onPostReply }) => {
  const [editedReply, setEditedReply] = useState(aiReply);

  useEffect(() => {
    setEditedReply(aiReply);
  }, [aiReply]);

  return (
    <div className='ai-reply-box'>
      {aiReply ? (
        <>
          <textarea
            value={editedReply}
            onChange={(e) => setEditedReply(e.target.value)}
            rows={4}
            className='w-full p-2 border rounded'
          />
          <button
            onClick={() => onPostReply(editedReply)}
            className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
          >
            Post Reply
          </button>
        </>
      ) : (
        <p>No AI reply generated yet.</p>
      )}
    </div>
  );
};

export default AIReplyBox;
