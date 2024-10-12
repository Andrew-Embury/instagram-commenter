import React, { useState } from 'react';
import { generateAIResponse, postAIResponse } from '../lib/ai';

interface Comment {
  id: string;
  text: string;
  // Add other properties as needed
}

interface CommentSectionProps {
  postCaption: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postCaption,
  comments,
}) => {
  const [aiReplies, setAiReplies] = useState<{ [key: string]: string }>({});

  const handleGenerateAIReply = async (comment: Comment) => {
    const aiReply = await generateAIResponse(comment.text, postCaption);
    setAiReplies((prev) => ({ ...prev, [comment.id]: aiReply }));
  };

  const handlePostAIReply = async (commentId: string) => {
    const aiReply = aiReplies[commentId];
    if (aiReply) {
      try {
        await postAIResponse(commentId, aiReply);
        // Handle successful posting (e.g., show a success message)
      } catch (error) {
        console.error('Failed to post AI response:', error);
        // Handle error (e.g., show an error message)
      }
    }
  };

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
          <button onClick={() => handleGenerateAIReply(comment)}>
            Generate AI Reply
          </button>
          {aiReplies[comment.id] && (
            <>
              <p>{aiReplies[comment.id]}</p>
              <button onClick={() => handlePostAIReply(comment.id)}>
                Post AI Reply
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
