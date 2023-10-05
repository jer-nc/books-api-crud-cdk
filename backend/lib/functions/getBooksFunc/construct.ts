import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

// Explanation: 
// This function is used to get all books from the books table.

type GetBooksFuncProps = {
    functionName: string
    booksTableArn: string
    enviromentVars : { booksTableName: string }
}

export const createGetBooksFunc = (scope: Construct, props: GetBooksFuncProps) => {

    const getBooksFunc = new NodejsFunction(scope, `${props.functionName}`, {
        functionName: `${props.functionName}`,
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: path.join(__dirname, `./main.ts`),
        environment: {
            BOOKS_TABLE_NAME: props.enviromentVars.booksTableName
        }
    })

    getBooksFunc.addToRolePolicy(new PolicyStatement({
        actions: ['dynamodb:Scan'],
        resources: [props.booksTableArn]
    }))

    return getBooksFunc
}