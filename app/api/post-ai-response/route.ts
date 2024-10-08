import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { commentId, response } = await request.json();

  // Implement your webhook call and Supabase update here
  console.log(`Posting AI response for comment ${commentId}: ${response}`);

  // Call your webhook and update Supabase here

  return NextResponse.json({ success: true });
}
