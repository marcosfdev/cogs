import { get } from 'svelte/store';
import { DynamoDB } from 'aws-sdk'; // Assuming AWS SDK already imported and configured in `env`

// Error handling function for a more informative response
function handleError(error, status = 500) {
  console.error(error);
  return new Response('An error occurred. Please try again later.', { status });
}

export async function GET({ params }) {
  const { hash } = params;
  const email = await verifyConfirmationLink(hash);

  if (email) {
    await activateSubscription(email);
    return new Response('Subscription confirmed successfully!', { status: 200 });
  } else {
    return new Response('Invalid confirmation link.', { status: 400 });
  }
}

async function verifyConfirmationLink(hash) {
  const { timestamp, email } = parseConfirmationLinkHash(hash);
  const currentTime = Date.now();
  const expirationTime = timestamp + (EXPIRATION_TIME_MINUTES * 60 * 1000); // Convert minutes to milliseconds

  if (currentTime > expirationTime) {
    return null; // Link expired
  }

  try {
    const data = await getConfirmationLinkData(email, hash); // Use separate function for DynamoDB interaction
    return data?.email; // Return email if hash matches and data exists
  } catch (error) {
    return handleError(error);
  }
}

// Separate function for DynamoDB interaction (reusable)
async function getConfirmationLinkData(email, hash) {
  const db = new DynamoDB({ region: get('env').AWS_REGION });
  const params = {
    TableName: 'NewsletterEmails', // DynamoDB table name
    Key: {
      email: { S: email },
      confirmationHash: { S: hash },
    },
  };

  return await db.getItem(params).promise();
}

function parseConfirmationLinkHash(hash) {
  // Implement logic to split the hash and extract timestamp and email
  // This example assumes a specific format (email:timestamp:hash)
  const parts = hash.split(':');
  return { timestamp: parseInt(parts[1]), email: parts[0] };
}

async function activateSubscription(email) {
  // Implement logic to update the user's subscription status in DynamoDB
  // This example updates a 'subscribed' attribute to true
  try {
    await updateSubscriptionStatus(email, true); // Use separate function for update
    console.log('Subscription activated successfully for:', email);
  } catch (error) {
    handleError(error);
  }
}

// Separate function for DynamoDB update (reusable)
async function updateSubscriptionStatus(email, subscribed) {
  const db = new DynamoDB({ region: get('env').AWS_REGION });
  const params = {
    TableName: 'YourTableName', // Replace with your DynamoDB table name
    Key: {
      email: { S: email },
    },
    UpdateExpression: 'SET subscribed = :subscribed',
    ExpressionAttributeValues: {
      ':subscribed': { BOOL: subscribed },
    },
  };

  await db.updateItem(params).promise();
}