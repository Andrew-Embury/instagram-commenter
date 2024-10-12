const crypto = require('crypto');

function generateBearerToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

const token = generateBearerToken();
console.log('Generated Bearer Token:', token);

// Store this token securely and use it for webhook authentication
