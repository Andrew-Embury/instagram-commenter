import { NextResponse } from 'next/server';
import axios from 'axios';

interface WebhookResponse {
  output: string;
}

export async function POST(request: Request) {
  const { message, caption } = await request.json();
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookToken = process.env.WEBHOOK_TOKEN;

  console.log('Request body:', { message, caption });

  if (!webhookUrl || !webhookToken) {
    console.error('Webhook configuration is missing');
    return NextResponse.json(
      { error: 'Webhook configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const requestBody = {
      message,
      caption,
    };
    console.log('Sending to webhook:', requestBody);

    const response = await axios.post<WebhookResponse>(
      webhookUrl,
      requestBody,
      {
        headers: {
          'x-webhook-token': webhookToken,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Webhook response:', response.data);

    // Now this line should work without type errors
    return NextResponse.json({ reply: response.data.output });
  } catch (error) {
    console.error('Error calling webhook:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
