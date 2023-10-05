import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';


type putBooksFuncProps = {
    functionName: string
    booksTableArn: string
    enviromentVars : { booksTableName: string }
}
// Explanation:
// This function is used to put a book into the books table.

export const createPutBooksFunc = (scope: Construct, props: putBooksFuncProps) => {
    const putBooksFunc = new NodejsFunction(scope, `${props.functionName}`, {
        functionName: `${props.functionName}`,
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: path.join(__dirname, `./main.ts`),
        environment: {
            BOOKS_TABLE_NAME: props.enviromentVars.booksTableName
        }
    })

    // Allow the function to put and update items in the books table (ROLE PERMISSIONS)
    putBooksFunc.addToRolePolicy(new PolicyStatement({
        actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem'],
        resources: [props.booksTableArn]
    }))

    return putBooksFunc
}
