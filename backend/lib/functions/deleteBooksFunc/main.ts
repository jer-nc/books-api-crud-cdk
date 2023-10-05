import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();

// Delete Item from DynamoDB table

async function deleteItem(id: string) {
    const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Key: {
            id: { S: id }
        }
    }
    try {
        const data = await client.send(new DeleteItemCommand(params));
        console.log("Success", data);
        return data;
    } catch (err) {
        console.log("Error", err);
        throw err;
    }
}

exports.handler = async (event: any) => {
    console.log('Event: ', JSON.parse(event.body));

    const { id } = JSON.parse(event.body);

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Id is required' })
        }
    }

    await deleteItem(id);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            message: `Book deleted successfully with id: ${id}`
        })
    }
};