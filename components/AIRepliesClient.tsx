'use client';

import { useState } from 'react';
import { Comment } from '@/types/instagram';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

type AIRepliesClientProps = {
  initialComments: Comment[];
  postId: string;
};

const CommentRow = ({
  comment,
  depth = 0,
  selectedComments,
  aiResponses,
  onSelectComment,
  onAiResponseChange,
}: {
  comment: Comment;
  depth?: number;
  selectedComments: string[];
  aiResponses: { [key: string]: string };
  onSelectComment: (commentId: string, checked: boolean) => void;
  onAiResponseChange: (commentId: string, response: string) => void;
}) => (
  <>
    <TableRow>
      <TableCell style={{ paddingLeft: `${depth * 20}px` }}>
        <Checkbox
          checked={selectedComments.includes(comment.id)}
          onCheckedChange={(checked) =>
            onSelectComment(comment.id, checked as boolean)
          }
        />
      </TableCell>
      <TableCell>
        <div>
          <p className='font-bold'>{comment.username}</p>
          <p>{comment.text}</p>
          <p className='text-sm text-gray-500'>
            {format(new Date(comment.timestamp), 'dd/MM/yyyy, HH:mm:ss')}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Textarea
          value={
            aiResponses[comment.id] ||
            `Thank you for your comment. We appreciate your feedback!`
          }
          onChange={(e) => onAiResponseChange(comment.id, e.target.value)}
          rows={3}
        />
      </TableCell>
    </TableRow>
    {comment.replies && comment.replies.length > 0 && (
      <>
        {[...comment.replies].reverse().map((reply) => (
          <CommentRow
            key={reply.id}
            comment={reply}
            depth={depth + 1}
            selectedComments={selectedComments}
            aiResponses={aiResponses}
            onSelectComment={onSelectComment}
            onAiResponseChange={onAiResponseChange}
          />
        ))}
      </>
    )}
  </>
);

export default function AIRepliesClient({
  initialComments,
  postId,
}: AIRepliesClientProps) {
  const [comments, setComments] = useState(initialComments);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<{ [key: string]: string }>({});

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allCommentIds = comments.flatMap((comment) => [
        comment.id,
        ...(comment.replies?.map((reply) => reply.id) || []),
      ]);
      setSelectedComments(allCommentIds);
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelectComment = (commentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComments((prev) => [...prev, commentId]);
    } else {
      setSelectedComments((prev) => prev.filter((id) => id !== commentId));
    }
  };

  const handleAiResponseChange = (commentId: string, response: string) => {
    setAiResponses((prev) => ({ ...prev, [commentId]: response }));
  };

  const handlePostComments = () => {
    console.log(
      'Posting selected comments:',
      selectedComments.map((id) => ({
        commentId: id,
        aiResponse:
          aiResponses[id] ||
          `Thank you for your comment. We appreciate your feedback!`,
      }))
    );
    // Here you would typically send this data to your backend
  };

  // Filter out comments that are replies
  const topLevelComments = comments.filter(
    (comment) =>
      !comments.some((c) => c.replies?.some((r) => r.id === comment.id))
  );

  return (
    <div className='space-y-6'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>
              <Checkbox
                checked={
                  selectedComments.length ===
                  comments.flatMap((c) => [c, ...(c.replies || [])]).length
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>AI Reply</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topLevelComments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              selectedComments={selectedComments}
              aiResponses={aiResponses}
              onSelectComment={handleSelectComment}
              onAiResponseChange={handleAiResponseChange}
            />
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handlePostComments}
        disabled={selectedComments.length === 0}
      >
        Post Selected Comments
      </Button>
    </div>
  );
}
