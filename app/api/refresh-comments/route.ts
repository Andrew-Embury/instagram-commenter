import { NextResponse } from 'next/server';
import { fetchInstagramComments } from '@/app/lib/instagram';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const { comments } = await fetchInstagramComments(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error refreshing comments:', error);
    return NextResponse.json(
      { error: 'Failed to refresh comments' },
      { status: 500 }
    );
  }
}
