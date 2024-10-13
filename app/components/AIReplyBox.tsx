'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import ConfirmationModal from './ConfirmationModal';

interface AIReplyBoxProps {
  aiReply: string;
  onPostReply: (editedReply: string) => void;
}

const AIReplyBox: React.FC<AIReplyBoxProps> = ({ aiReply, onPostReply }) => {
  const [editedReply, setEditedReply] = useState(
    aiReply || 'No reply generated yet'
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    setEditedReply(aiReply || 'No reply generated yet');
  }, [aiReply]);

  const handlePostClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    onPostReply(editedReply);
    setIsConfirmationOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className='space-y-2'>
      <Textarea
        value={editedReply}
        onChange={(e) => setEditedReply(e.target.value)}
        rows={4}
        placeholder='No reply generated yet'
        className='w-full p-2 border rounded'
        readOnly={!aiReply}
      />
      {aiReply && (
        <Button onClick={handlePostClick} className='w-full' variant='default'>
          Post Reply
        </Button>
      )}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AIReplyBox;
