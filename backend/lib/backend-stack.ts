import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createCRUDLAPIGateway } from './api/apigateway'
import { createBooksTable } from './database/booksTable';
import { createGetBooksFunc } from './functions/getBooksFunc/construct';
import { createPutBooksFunc } from './functions/putBooksFunc/construct';
import { createDeleteBooksFunc } from './functions/deleteBooksFunc/construct';
import { createGetItemBooksFunc } from './functions/getItemBookFunc/construct';
import { createCognitoPool } from './auth/authPool';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Books DynamoDB table 
    const booksTable = createBooksTable(this, {
      tableName: 'booksTable2'
    })

    // Create a User Pool Client for the API
    const userPoolClient = createCognitoPool(this, {
      poolName: 'booksUserPool2'
    })

    // Create the getBooksFunc Lambda function
    const getBooksFunc = createGetBooksFunc(this, {
      functionName: 'getBooksFunc2',
      booksTableArn: booksTable.tableArn,
      enviromentVars: {
        booksTableName: booksTable.tableName
      }
    })

    // Create the putBooksFunc Lambda function
    const putBooksFunc = createPutBooksFunc(this, {
      functionName: 'putBooksFunc2',
      booksTableArn: booksTable.tableArn,
      enviromentVars: {
        booksTableName: booksTable.tableName
      }
    })

    // Create the deleteBooksFunc Lambda function
    const deleteBooksFunc = createDeleteBooksFunc(this, {
      functionName: 'deleteBooksFunc2',
      booksTableArn: booksTable.tableArn,
      enviromentVars: {
        booksTableName: booksTable.tableName
      }
    })

    // Create the getItemBooksFunc Lambda function
    const getItemBooksFunc = createGetItemBooksFunc(this, {
      functionName: 'getItemBooksFunc2',
      booksTableArn: booksTable.tableArn,
      enviromentVars: {
        booksTableName: booksTable.tableName
      }
    })
    
    // Create the API Gateway for the Books API (/books)
    const booksAPI = createCRUDLAPIGateway(this, {
      apiName: 'Books2',
      baseResourceName: 'books',
      getAllBaseFunc: getBooksFunc,
      putItemBaseFunc: putBooksFunc,
      deleteItemBaseFunc: deleteBooksFunc,
      leafResourceName: 'bookId',
      getItemLeafFunc: getItemBooksFunc,
      userPoolClient: userPoolClient
    })

  }
}
