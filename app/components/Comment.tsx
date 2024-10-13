import React from 'react';
import { InstagramComment } from '@/types/instagram';

interface CommentProps {
  comment: InstagramComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className='flex flex-col'>
      <p className='text-sm font-semibold text-gray-800'>{comment.username}</p>
      <p className='text-sm text-gray-600'>{comment.text}</p>
      <p className='text-xs text-gray-400 mt-1'>{comment.timestamp}</p>
    </div>
  );
};

export default Comment;
