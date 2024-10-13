import { NextResponse } from 'next/server';
import { fetchInstagramPosts } from '@/app/lib/instagram';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await fetchInstagramPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
