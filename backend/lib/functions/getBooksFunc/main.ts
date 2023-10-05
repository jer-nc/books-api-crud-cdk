import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient();

const params = {
    TableName: process.env.BOOKS_TABLE_NAME
};

// What is Unmarshalling? 
// Unmarshalling is the process of transforming the native representation of an item in DynamoDB to a more convenient one in your programming language.


async function scanAndUnmarshall() {
    try {
        const results = await client.send(new ScanCommand(params));
        console.log(results);
        // Input Example:
        // { Items: [ { id: { S: '1' }, title: { S: 'The Awakening' }, author: { S: 'Kate Chopin' } }, { id: { S: '2' }, title: { S: 'City of Glass' }, author: { S: 'Paul Auster' } } ], Count: 2, ScannedCount: 2 }

        if (results.Items) {
            // Unmarshall the Items field in the response.
            // Output Example:
            // [ { id: '1', title: 'The Awakening', author: 'Kate Chopin' }, { id: '2', title: 'City of Glass', author: 'Paul Auster' } ]
            return results.Items.map((item) => unmarshall(item));
        }
        return results;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Explanation:
// This function is used to get all books from the books table.
// The function uses the DynamoDB Scan API to get all books from the books table.
exports.handler = async () => {
    const results = await scanAndUnmarshall();
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Controll-Allow-Credentials': true,
        },
        body: JSON.stringify(results)
    }
}