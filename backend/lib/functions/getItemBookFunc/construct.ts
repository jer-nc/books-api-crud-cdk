import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

// Define the props type for the createGetItemBookFunc function
type getItemBookFuncProps = {
    functionName: string
    booksTableArn: string
    enviromentVars: { booksTableName: string }
}   

// Define the createGetItemBookFunc function that creates the getItemBookFunc Lambda function 
export const createGetItemBooksFunc = (scope: Construct, props: getItemBookFuncProps) => {
    const getItemBooksFunc = new NodejsFunction(scope, `${props.functionName}`, {
        functionName: `${props.functionName}`,
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: path.join(__dirname, `./main.ts`),
        environment: {
            BOOKS_TABLE_NAME: props.enviromentVars.booksTableName
        }
    })

    // Add the IAM policy to the getItemBookFunc Lambda function that allows it to get an item from the Books DynamoDB table
    getItemBooksFunc.addToRolePolicy(
        new PolicyStatement({
            actions: ['dynamodb:GetItem'],
            resources: [props.booksTableArn]
        }))

    return getItemBooksFunc
}