import React from 'react';
import { InstagramComment } from '@/types/instagram';

interface CommentProps {
  comment: InstagramComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className='comment'>
      <p className='font-bold'>{comment.username}</p>
      <p>{comment.text}</p>
      <p className='text-sm text-gray-500'>
        {new Date(comment.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default Comment;
