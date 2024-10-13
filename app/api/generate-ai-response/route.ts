import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai';

export async function POST(request: Request) {
  try {
    const { message, caption } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const reply = await generateAIResponse(message, caption || '');

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI reply' },
      { status: 500 }
    );
  }
}
