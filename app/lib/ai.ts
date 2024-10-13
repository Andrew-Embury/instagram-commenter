import axios from 'axios';

interface WebhookResponse {
  output: string; // Change this from 'reply' to 'output'
}

async function callWebhook(caption: string, message: string): Promise<string> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  const webhookToken = process.env.NEXT_PUBLIC_WEBHOOK_TOKEN;

  if (!webhookUrl || !webhookToken) {
    console.error(
      'NEXT_PUBLIC_WEBHOOK_URL or NEXT_PUBLIC_WEBHOOK_TOKEN is not set in environment variables'
    );
    return '';
  }

  try {
    const response = await axios.post<WebhookResponse>(
      webhookUrl,
      {
        message: message,
        caption: caption,
      },
      {
        headers: {
          'x-webhook-token': webhookToken,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.output; // Change this from 'reply' to 'output'
  } catch (error) {
    console.error('Error calling webhook:', error);
    return '';
  }
}

export async function generateAIResponse(
  commentText: string,
  postCaption: string
) {
  // console.log('generateAIResponse received postCaption:', postCaption); // Add this line

  const response = await fetch('/api/generate-ai-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commentText,
      caption: postCaption || '', // Ensure caption is always a string
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate AI response');
  }

  const data = await response.json();
  return data.reply;
}

export async function postAIResponse(commentId: string, response: string) {
  const res = await fetch('/api/post-ai-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commentId, response }),
  });

  if (!res.ok) {
    throw new Error('Failed to post AI response');
  }

  return res.json();
}
