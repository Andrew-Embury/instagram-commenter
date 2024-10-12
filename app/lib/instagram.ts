import { Post, InstagramComment } from '@/types/instagram';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/v12.0';

export async function fetchInstagramPost(postId: string): Promise<Post> {
  const url = `${INSTAGRAM_API_URL}/${postId}?fields=id,media_url,caption,like_count,comments_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Instagram post: ${response.status}`);
  }

  const data = await response.json();

  // Transform the API response to match our Post interface
  const post: Post = {
    id: data.id,
    imageUrl: data.media_url, // Map media_url to imageUrl
    caption: data.caption,
    like_count: data.like_count,
    comments_count: data.comments_count,
  };

  return post;
}

export async function fetchInstagramComments(
  postId: string
): Promise<InstagramComment[]> {
  const response = await fetch(
    `${INSTAGRAM_API_URL}/${postId}/comments?fields=id,text,timestamp,username,parent_id&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch Instagram comments');
  }
  const data = await response.json();
  return data.data;
}
