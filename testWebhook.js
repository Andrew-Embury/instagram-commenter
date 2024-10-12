require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testWebhook() {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/generate-ai-response',
      {
        comment: 'i love the new colours',
        postId: 'test-post-id',
        caption: 'look at our new logo',
      }
    );

    console.log('AI response:', response.data.reply);
  } catch (error) {
    console.error('Error testing AI response generation:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWebhook();
