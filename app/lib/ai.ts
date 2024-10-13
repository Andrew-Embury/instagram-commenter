import axios from 'axios';

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;

export async function generateAIResponse(
  commentText: string,
  postCaption: string
): Promise<string> {
  if (!WEBHOOK_URL || !WEBHOOK_TOKEN) {
    throw new Error('Webhook configuration is missing');
  }

  try {
    const response = await axios.post(
      WEBHOOK_URL,
      {
        message: commentText,
        caption: postCaption,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-token': WEBHOOK_TOKEN,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to generate AI response');
    }

    return response.data.output;
  } catch (error) {
    console.error('Error in generateAIResponse:', error);
    throw error;
  }
}

export async function postAIResponse(
  commentId: string,
  response: string
): Promise<void> {
  // Implement your logic to post the AI response to Instagram here
  console.log(`Posting AI response for comment ${commentId}: ${response}`);
  // This is where you'd make the actual API call to Instagram
}
