import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient();


async function getItem(id: string) {
    // Get the item from the DynamoDB table by id
    const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Key: {
            id: { S: id }
        }
    }
    try {
        // Use the DynamoDBClient send method to get the item from the DynamoDB table
        const results = await client.send(new GetItemCommand(params));
        if (results.Item) {
            // Return the unmarshalled item from the DynamoDB table
            return unmarshall(results.Item);
        } else {
            return null;
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.handler = async (event: any) => {
    // /books/{bookId} 
    const id = event.pathParameters?.bookId;

    // Check if the bookId is provided
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Book ID is required'
            })
        }
    }

    // Get the item from the DynamoDB table by id
    const item = await getItem(id);

    // Check if the item was found in the DynamoDB table
    if (!item) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: `Book with ID ${id} not found`
            })
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(item)
    }

};