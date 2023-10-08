# AWS Lambda Function for Deleting a Book 

## Overview

This README provides an explanation of an AWS Lambda function written in TypeScript and its corresponding `main.ts` and `construct.ts` files.

The Lambda function is designed to delete an item from a DynamoDB table.

### `main.ts`

The `main.ts` file contains the code for the Lambda function's execution. It is responsible for connecting to DynamoDB, deleting an item from the specified table, and responding to API Gateway requests.

```typescript
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
```

#### Functionality

- Imports the necessary AWS SDK modules for DynamoDB interaction.
- Initializes a DynamoDB client.
- Defines an `async` function called `deleteItem` to delete an item from the DynamoDB table based on the provided `id`.
- Exports an `async` Lambda function handler that:
  - Parses the input event and extracts the `id` from the request body.
  - Validates the presence of the `id` and returns a `400 Bad Request` response if it's missing.
  - Calls the `deleteItem` function to delete the item from the DynamoDB table.
  - Returns a `200 OK` response with CORS headers and a success message.

### `construct.ts`

The `construct.ts` file contains the AWS CDK construct code for creating the Lambda function and configuring its role policy.

```typescript
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

type deleteBooksFuncProps = {
    functionName: string
    booksTableArn: string
    enviromentVars: { booksTableName: string }
}

export const createDeleteBooksFunc = (scope: Construct, props: deleteBooksFuncProps) => {
    const deleteBooksFunc = new NodejsFunction(scope, `${props.functionName}`, {
        functionName: `${props.functionName}`,
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: path.join(__dirname, `./main.ts`),
        environment: {
            BOOKS_TABLE_NAME: props.enviromentVars.booksTableName
        }
    })

    deleteBooksFunc.addToRolePolicy(
        new PolicyStatement({
            actions: ['dynamodb:DeleteItem'],
            resources: [props.booksTableArn]
        }))

    return deleteBooksFunc
}
```

#### Functionality

- Imports necessary AWS CDK modules and TypeScript dependencies.
- Defines a function `createDeleteBooksFunc` that creates and configures an AWS Lambda function using the `NodejsFunction` construct from the AWS CDK.
- The function accepts parameters including the function name, DynamoDB table ARN, and environment variables.
- It configures the Lambda function's runtime, handler, entry point (`main.ts`), and environment variables.
- Adds a policy statement to the Lambda function's role that grants permission to delete items in the specified DynamoDB table.
- Returns the configured Lambda function.
