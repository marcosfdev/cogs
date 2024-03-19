import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION  
});

async function saveEmail(email) {
  const params = {
    TableName: 'NewsletterEmails',
    Item: {
      email: { S: email }
    }
  };

  try {
    await db.putItem(params).promise();
  } catch (err) {
    console.error('Error saving email', err);
  }
}
