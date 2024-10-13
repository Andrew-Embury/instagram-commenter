'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';

interface AIReplyBoxProps {
  aiReply: string;
  onPostReply: (editedReply: string) => void;
}

const AIReplyBox: React.FC<AIReplyBoxProps> = ({ aiReply, onPostReply }) => {
  const [editedReply, setEditedReply] = useState('');

  useEffect(() => {
    setEditedReply(aiReply);
  }, [aiReply]);

  return (
    <div className='space-y-2'>
      <Textarea
        value={editedReply}
        onChange={(e) => setEditedReply(e.target.value)}
        placeholder='AI reply will appear here'
        rows={4}
        className='w-full p-2 border rounded'
      />
      {aiReply && (
        <Button
          onClick={() => onPostReply(editedReply)}
          className='w-full'
          variant='default'
        >
          Post Reply
        </Button>
      )}
    </div>
  );
};

export default AIReplyBox;
