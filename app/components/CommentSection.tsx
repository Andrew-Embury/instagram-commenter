'use client';

import React, { useEffect, useState } from 'react';
import CommentThread from './CommentThread';
import { InstagramComment } from '@/types/instagram';

interface CommentSectionProps {
  comments: InstagramComment[];
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
}) => {
  const [topLevelComments, setTopLevelComments] = useState<InstagramComment[]>(
    []
  );

  useEffect(() => {
    // Create a set of all reply IDs
    const replyIds = new Set(
      comments.flatMap(
        (comment) => comment.replies?.map((reply) => reply.id) || []
      )
    );

    // Filter out top-level comments (those that are not in the replyIds set)
    const topLevel = comments.filter((comment) => !replyIds.has(comment.id));

    // Sort top-level comments in chronological order (oldest first)
    const sortedTopLevel = topLevel.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    setTopLevelComments(sortedTopLevel);
  }, [comments]);

  return (
    <div>
      {topLevelComments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          replies={comment.replies || []}
          postId={postId}
        />
      ))}
    </div>
  );
};

export default CommentSection;
