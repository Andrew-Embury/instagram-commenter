import { NextResponse } from 'next/server';
import { fetchInstagramPost } from '@/app/lib/instagram';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await fetchInstagramPost(params.postId);
    console.log('API route fetched post:', post);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching Instagram post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
