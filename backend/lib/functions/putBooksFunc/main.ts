import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient();

// Explanation:
// This function is used to put a book into the books table. It also can update a book if the book already exists in the table based on the id of the book.

async function lambdaHandler(event: any): Promise<any> {
    // Parse the request body from the frontend
    const itemData = JSON.parse(event.body);
    // Set unique id for the item if it doesn't exist
    itemData.id = itemData.id ?? uuidv4();

    // Marshall the item data to put into the DynamoDB table
    const marshalledItem = marshall(itemData);

    // Set the parameters for the DynamoDB putItem function
    const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Item: marshalledItem
    };

    try {
        // Put the item into the DynamoDB table
        await client.send(new PutItemCommand(params));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Controll-Allow-Credentials': true,
            },
            body: 'Item added to the table successfully!' // We can return JSON.stringify(itemData) if we want to return the item that was added to the table
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        }
    }

}
exports.handler = lambdaHandler;