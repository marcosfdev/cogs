import { get } from 'svelte/store';
import { DynamoDB } from 'aws-sdk';
import {
  validateHashFormat,
  handleError,
  sanitizeHash,
} from './utils.js'; // Assuming utils.js is in the same directory

const MAX_ATTEMPTS_PER_USER = 5; // Adjust this value as needed
const ATTEMPT_LOCKOUT_PERIOD = 60 * 60 * 1000; // 1 hour in milliseconds

// Store for tracking attempts (replace with a more robust solution in production)
const attemptStore = {};

// Environment variables
const env = get('env'); // Assuming env is configured with AWS_REGION and TABLE_NAME
const dynamoDB = new DynamoDB({ region: env.AWS_REGION });
const tableName = env.TABLE_NAME;

export async function GET({ params }) {
  const { hash } = params;

  try {
    const sanitizedHash = sanitizeHash(hash); // Sanitize input to prevent injection attacks

    if (!validateHashFormat(sanitizedHash)) {
      return handleError(new Error('Invalid confirmation link format'), 400);
    }

    const email = await verifyConfirmationLink(sanitizedHash);

    if (email) {
      await activateSubscription(email);
      return new Response('Subscription confirmed successfully!', { status: 200 });
    } else {
      return new Response('Invalid confirmation link.', { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

async function verifyConfirmationLink(hash) {
  // Rate limiting logic
  const user = // Retrieve user information based on hash (e.g., from email)
  if (attemptStore[user] && attemptStore[user] >= MAX_ATTEMPTS_PER_USER) {
    throw new Error('Too many attempts. Please try again later.');
  }
  attemptStore[user] = (attemptStore[user] || 0) + 1;
  setTimeout(() => {
    attemptStore[user] = Math.max(0, attemptStore[user] - 1);
  }, ATTEMPT_LOCKOUT_PERIOD);

  const { timestamp, email } = parseConfirmationLinkHash(hash);
  const currentTime = Date.now();
  const expirationTime = timestamp + (EXPIRATION_TIME_MINUTES * 60 * 1000);

  if (currentTime > expirationTime) {
    return null; // Link expired
  }

  try {
    const data = await getConfirmationLinkData(email, hash);
    return data?.email;
  } catch (error) {
    return handleError(error);
  }
}

// Separate function for DynamoDB interaction (reusable)
async function getConfirmationLinkData(email, hash) {
  const params = {
    TableName: tableName,
    Key: {
      email: { S: email },
      confirmationHash: { S: hash },
    },
  };

  return await dynamoDB.getItem(params).promise();
}

function parseConfirmationLinkHash(hash) {
  // Implement logic to split the hash and extract timestamp and email based on your specific format
  return { timestamp: parseInt(hash.split(':')[1]), email: hash.split(':')[0] };
}

async function activateSubscription(email) {
  try {
    await updateSubscriptionStatus(email, true);
    console.log('Subscription activated successfully for:', email);
    await rotateConfirmationHash(email); // Rotate confirmation hash
  } catch (error) {
    handleError(error);
  }
}

async function rotateConfirmationHash(email) {
  // Implement logic to generate a new confirmation hash and update it in DynamoDB
}

async function updateSubscriptionStatus(email, subscribed) {
  const params = {
    TableName: tableName,
    Key: {
      email: { S: email },
    },
    UpdateExpression: 'SET subscribed = :subscribed',
    ExpressionAttributeValues: {
      ':subscribed': { BOOL: subscribed },
    },
  };

  await dynamoDB.updateItem(
