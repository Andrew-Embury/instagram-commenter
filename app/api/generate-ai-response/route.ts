import { NextResponse } from 'next/server';
import axios from 'axios';

interface WebhookResponse {
  output: string;
}

export async function POST(request: Request) {
  const { message, caption } = await request.json();
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookToken = process.env.WEBHOOK_TOKEN;

  if (!webhookUrl || !webhookToken) {
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

    return NextResponse.json({ reply: response.data.output });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
