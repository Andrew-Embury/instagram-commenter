import { Post, InstagramComment } from '@/types/instagram';

const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com/v20.0';
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function fetchInstagramPosts(): Promise<Post[]> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const response = await fetch(
    `${INSTAGRAM_API_BASE_URL}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count&access_token=${ACCESS_TOKEN}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram posts');
  }

  const data = await response.json();

  return data.data.map((post: any) => ({
    id: post.id,
    imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
    caption: post.caption || 'There is no caption for this post',
    likes: post.like_count || 0,
  }));
}

export async function fetchInstagramPost(postId: string): Promise<Post> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'timestamp',
    'like_count',
  ].join(',');

  const response = await fetch(
    `${INSTAGRAM_API_BASE_URL}/${postId}?fields=${fields}&access_token=${ACCESS_TOKEN}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram post');
  }

  const post = await response.json();

  return {
    id: post.id,
    imageUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
    caption: post.caption || 'There is no caption for this post',
    likes: post.like_count || 0,
    mediaType: post.media_type,
    permalink: post.permalink,
    timestamp: post.timestamp,
  };
}

export async function fetchInstagramComments(
  postId: string,
  after?: string
): Promise<{ comments: InstagramComment[]; next?: string }> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  let allComments: InstagramComment[] = [];
  let nextCursor = after;

  do {
    let url = `${INSTAGRAM_API_BASE_URL}/${postId}/comments?fields=id,text,username,timestamp,replies{id,text,username,timestamp}&limit=50&access_token=${ACCESS_TOKEN}`;

    if (nextCursor) {
      url += `&after=${nextCursor}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram comments');
    }

    const data = await response.json();

    const comments: InstagramComment[] = data.data.map((comment: any) => ({
      id: comment.id,
      text: comment.text,
      username: comment.username,
      timestamp: new Date(comment.timestamp).toISOString(),
      replies: comment.replies
        ? comment.replies.data.map((reply: any) => ({
            id: reply.id,
            text: reply.text,
            username: reply.username,
            timestamp: new Date(reply.timestamp).toISOString(),
          }))
        : [],
    }));

    allComments = [...allComments, ...comments];
    nextCursor = data.paging?.cursors?.after;
  } while (nextCursor);

  return {
    comments: allComments,
    next: nextCursor,
  };
}

export async function postReplyToInstagram(
  postId: string,
  commentId: string,
  replyText: string
): Promise<void> {
  const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const url = `https://graph.instagram.com/v20.0/${commentId}/replies`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: replyText,
        access_token: ACCESS_TOKEN,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Instagram API Error:', errorData);
      throw new Error(`Failed to post reply: ${errorData.error.message}`);
    }

    const responseData = await response.json();
    console.log('Instagram API Response:', responseData);
  } catch (error) {
    console.error('Error in postReplyToInstagram:', error);
    throw error;
  }
}
