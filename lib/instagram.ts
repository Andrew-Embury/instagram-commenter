import { Post, InstagramComment } from '@/types/instagram';

const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com/v20.0';
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function fetchInstagramPosts(): Promise<Post[]> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const response = await fetch(
    `${INSTAGRAM_API_BASE_URL}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count&access_token=${ACCESS_TOKEN}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram posts');
  }

  const data = await response.json();

  return data.data.map((post: any) => ({
    id: post.id,
    imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
    caption: post.caption || '',
    likes: post.like_count || 0,
  }));
}

export async function fetchInstagramPost(postId: string): Promise<Post> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const response = await fetch(
    `${INSTAGRAM_API_BASE_URL}/${postId}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count&access_token=${ACCESS_TOKEN}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram post');
  }

  const post = await response.json();

  return {
    id: post.id,
    imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
    caption: post.caption || '',
    likes: post.like_count || 0,
  };
}

export async function fetchInstagramComments(
  postId: string
): Promise<InstagramComment[]> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const response = await fetch(
    `${INSTAGRAM_API_BASE_URL}/${postId}/comments?fields=id,text,username,timestamp,replies{id,text,username,timestamp}&access_token=${ACCESS_TOKEN}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram comments');
  }

  const data = await response.json();

  const comments: InstagramComment[] = data.data.map((comment: any) => ({
    id: comment.id,
    text: comment.text,
    username: comment.username,
    timestamp: comment.timestamp,
    replies: comment.replies
      ? comment.replies.data.map((reply: any) => ({
          id: reply.id,
          text: reply.text,
          username: reply.username,
          timestamp: reply.timestamp,
        }))
      : [],
  }));

  return comments;
}
