export async function generateAIResponse(comment: string) {
  // Implement your AI response generation logic here
  // This could involve calling an external API or using a local model
  return `Thank you for your comment: "${comment}". We appreciate your feedback!`;
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
