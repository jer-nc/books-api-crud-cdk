# AWS CDK Backend Stack

This AWS CDK (Cloud Development Kit) project sets up a serverless backend infrastructure for managing a collection of books. It leverages various AWS services, including Amazon DynamoDB for data storage, AWS Lambda for serverless functions, Amazon API Gateway for RESTful API endpoints, and Amazon Cognito for user authentication.

## Project Structure

### `BackendStack` Class

The heart of this project is the `BackendStack` class, which extends the AWS CDK `Stack` class. This class is responsible for defining and provisioning the entire backend infrastructure.

```typescript
export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ...
  }
}
```

### DynamoDB Table

We create a DynamoDB table to store information about books. The `createBooksTable` function sets up this table with a specified name (`booksTable2` in this example).

### User Authentication

This project also includes user authentication using Amazon Cognito. A user pool client is created to manage user access to the API.

### Lambda Functions

Several AWS Lambda functions are created to perform different operations on the books data. These functions include:
- `getBooksFunc`: Retrieves a list of books.
- `putBooksFunc`: Adds a new book to the database.
- `deleteBooksFunc`: Deletes a book from the database.
- `getItemBooksFunc`: Retrieves detailed information about a specific book.

Each Lambda function is configured with environment variables to access the DynamoDB table where book data is stored.

### API Gateway

An Amazon API Gateway is set up to expose RESTful endpoints for book management. This includes CRUD (Create, Read, Update, Delete, and List) operations on books. The `createCRUDLAPIGateway` function is used to define the API with endpoints like `/books` for listing books and `/books/{bookId}` for managing individual books.

## Getting Started

To deploy this infrastructure using the AWS CDK, follow these steps:

1. Clone the project repository.
2. Install the AWS CDK CLI if you haven't already.
3. Configure your AWS credentials.
4. Run `cdk deploy` to deploy the stack to your AWS account.

Make sure to customize the stack and resource names, and adjust any additional configuration as needed for your specific use case.

## Cleanup

To remove the deployed resources, run `cdk destroy`. This will clean up all AWS resources created by this stack.
