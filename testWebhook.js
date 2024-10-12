require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testWebhook() {
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookToken = process.env.WEBHOOK_TOKEN;

  if (!webhookUrl || !webhookToken) {
    console.error('WEBHOOK_URL or WEBHOOK_TOKEN is not set in .env.local');
    return;
  }

  try {
    const response = await axios.post(
      webhookUrl,
      { message: 'This is a test' },
      {
        headers: {
          'x-webhook-token': webhookToken,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Webhook test response:', response.data);
  } catch (error) {
    console.error('Error testing webhook:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWebhook();
