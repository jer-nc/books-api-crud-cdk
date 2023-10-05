import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

type BooksTableProps = {
    tableName: string
}

export const createBooksTable = (scope: Construct, props: BooksTableProps) => {
    const booksTable = new Table(scope, `${props.tableName}`, {
        tableName: props.tableName,
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING
        },
    })

    return booksTable;
}