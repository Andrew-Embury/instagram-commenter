'use client';

import React, { useState, useEffect } from 'react';

interface AIReplyBoxProps {
  aiReply: string;
  onPostReply: (editedReply: string) => void;
}

const AIReplyBox: React.FC<AIReplyBoxProps> = ({ aiReply, onPostReply }) => {
  const [editedReply, setEditedReply] = useState(
    aiReply || 'No reply generated yet'
  );

  useEffect(() => {
    setEditedReply(aiReply || 'No reply generated yet');
  }, [aiReply]);

  return (
    <div className='ai-reply-box'>
      <textarea
        value={editedReply}
        onChange={(e) => setEditedReply(e.target.value)}
        rows={4}
        className='w-full p-2 border rounded'
        placeholder='No reply generated yet'
        readOnly={!aiReply}
      />
      {aiReply && (
        <button
          onClick={() => onPostReply(editedReply)}
          className='mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          Post Reply
        </button>
      )}
    </div>
  );
};

export default AIReplyBox;
