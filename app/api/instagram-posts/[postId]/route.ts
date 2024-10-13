import { NextResponse } from 'next/server';
import { fetchInstagramPost } from '@/app/lib/instagram';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await fetchInstagramPost(params.postId);
    // Remove or comment out the following line:
    // console.log('Instagram API Response:', post);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching Instagram post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
