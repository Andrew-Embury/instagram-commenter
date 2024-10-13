import { Post, InstagramComment } from '@/types/instagram';

const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com/v20.0';
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

interface InstagramApiPost {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
}

interface InstagramApiComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: {
    data: InstagramApiComment[];
  };
}

interface InstagramApiCommentResponse {
  data: InstagramApiComment[];
  paging?: {
    cursors?: {
      after?: string;
    };
  };
}

export async function fetchInstagramPosts(): Promise<Post[]> {
  if (!ACCESS_TOKEN) {
    throw new Error('Instagram access token is not set');
  }

  const response = await fetch(
    `${INSTAGRAM_API_BASE_URL}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count&access_token=${ACCESS_TOKEN}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram posts');
  }

  const data: { data: InstagramApiPost[] } = await response.json();

  return data.data.map((post) => ({
    id: post.id,
    imageUrl:
      post.media_type === 'VIDEO'
        ? post.thumbnail_url || post.media_url
        : post.media_url,
    caption: post.caption || 'There is no caption for this post',
    likes: post.like_count || 0,
    mediaType: post.media_type,
    permalink: post.permalink,
    timestamp: post.timestamp,
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
    `${INSTAGRAM_API_BASE_URL}/${postId}?fields=${fields}&access_token=${ACCESS_TOKEN}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram post');
  }

  const post: InstagramApiPost = await response.json();

  return {
    id: post.id,
    imageUrl:
      post.media_type === 'VIDEO'
        ? post.thumbnail_url || post.media_url
        : post.media_url,
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

    const data: InstagramApiCommentResponse = await response.json();

    const comments: InstagramComment[] = data.data.map((comment) => ({
      id: comment.id,
      text: comment.text,
      username: comment.username,
      timestamp: comment.timestamp,
      replies: comment.replies
        ? comment.replies.data.map((reply) => ({
            id: reply.id,
            text: reply.text,
            username: reply.username,
            timestamp: reply.timestamp,
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
      const errorData: InstagramApiError = await response.json();
      console.error('Instagram API Error:', errorData);
      throw new Error(`Failed to post reply: ${errorData.error.message}`);
    }

    const responseData: InstagramApiReplyResponse = await response.json();
    console.log('Instagram API Response:', responseData);
  } catch (error) {
    console.error('Error in postReplyToInstagram:', error);
    throw error;
  }
}

// New type definitions
interface InstagramApiComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: {
    data: InstagramApiComment[];
  };
}

interface InstagramApiCommentResponse {
  data: InstagramApiComment[];
  paging?: {
    cursors?: {
      after?: string;
    };
  };
}

interface InstagramApiError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

interface InstagramApiReplyResponse {
  id: string;
}
