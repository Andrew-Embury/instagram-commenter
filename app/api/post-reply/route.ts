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
    console.error('Detailed error in POST /api/post-reply:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
