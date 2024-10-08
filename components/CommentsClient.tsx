'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Comment } from '@/types/instagram';
import { format } from 'date-fns';

const CommentItem = ({
  comment,
  depth = 0,
}: {
  comment: Comment;
  depth?: number;
}) => (
  <div className={`mb-4 ${depth > 0 ? 'ml-6' : ''}`}>
    <Card>
      <CardContent className='p-4'>
        <p className='font-bold'>{comment.username}</p>
        <p>{comment.text}</p>
        <p className='text-sm text-gray-500'>
          {format(new Date(comment.timestamp), 'dd/MM/yyyy, HH:mm:ss')}
        </p>
      </CardContent>
    </Card>
    {comment.replies && comment.replies.length > 0 && (
      <div className='mt-2 border-l-2 border-gray-200 pl-4'>
        {[...comment.replies].reverse().map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    )}
  </div>
);

export default function CommentsClient({
  initialComments,
  postId,
}: {
  initialComments: Comment[];
  postId: string;
}) {
  // Filter out comments that are replies
  const topLevelComments = initialComments.filter(
    (comment) =>
      !initialComments.some((c) => c.replies?.some((r) => r.id === comment.id))
  );

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-bold'>Comments</h3>
      <div>
        {topLevelComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
