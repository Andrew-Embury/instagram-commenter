import { NextResponse } from 'next/server';
import { postReplyToInstagram } from '@/app/lib/instagram';

export async function POST(request: Request) {
  try {
    const { postId, commentId, replyText } = await request.json();

    if (!postId || !commentId || !replyText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await postReplyToInstagram(postId, commentId, replyText);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error posting reply:', error);
    return NextResponse.json(
      { error: 'Failed to post reply' },
      { status: 500 }
    );
  }
}
