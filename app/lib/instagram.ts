import { Post, InstagramComment } from '@/types/instagram';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/v12.0';

export async function fetchInstagramPost(postId: string): Promise<Post> {
  const url = `${INSTAGRAM_API_URL}/${postId}?fields=id,media_url,caption,like_count,comments_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Instagram post: ${response.status}`);
  }

  const data = await response.json();
  console.log('Raw Instagram post data:', data);

  // Fetch comments to calculate total count including replies
  const comments = await fetchInstagramComments(postId);
  console.log('Fetched comments:', comments);

  const totalCommentCount = calculateTotalCommentCount(comments);
  console.log('Total comment count:', totalCommentCount);

  // Transform the API response to match our Post interface
  const post: Post = {
    id: data.id,
    imageUrl: data.media_url,
    caption: data.caption,
    likes: data.like_count,
    comments: totalCommentCount,
  };

  console.log('Transformed post object:', post);

  return post;
}

export async function fetchInstagramComments(
  postId: string
): Promise<InstagramComment[]> {
  const response = await fetch(
    `${INSTAGRAM_API_URL}/${postId}/comments?fields=id,text,timestamp,username,replies{id,text,timestamp,username}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch Instagram comments');
  }
  const data = await response.json();
  return data.data.map((comment: any) => ({
    ...comment,
    replies: comment.replies ? comment.replies.data : [],
  }));
}

function calculateTotalCommentCount(comments: InstagramComment[]): number {
  return comments.reduce((total, comment) => {
    // Count the comment itself
    let count = 1;
    // Add the count of all replies
    if (comment.replies && Array.isArray(comment.replies)) {
      count += comment.replies.length;
    }
    return total + count;
  }, 0);
}
