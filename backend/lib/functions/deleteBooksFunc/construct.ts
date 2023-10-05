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