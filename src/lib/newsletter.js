import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "REGION" }); // Replace with your AWS region

export async function subscribe(email) {
  const params = {
    TableName: "YOUR_TABLE_NAME", // Replace with your DynamoDB table name
    Item: {
      email: { S: email }, // Add email attribute of type String
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    return new Response(JSON.stringify({ message: 'Subscribed successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    return new Response(JSON.stringify({ message: 'Failed to subscribe' }), {
      status: 500,
    });
  }
}

