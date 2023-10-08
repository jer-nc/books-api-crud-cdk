# AWS CDK Service for CRUDL API Gateway

This AWS CDK service allows you to create an API Gateway with CRUDL (Create, Read, Update, Delete, and List) operations using AWS Lambda and Cognito authentication.

## Usage

To use this AWS CDK service, follow these steps:

1. Ensure that you have AWS CDK and its dependencies installed in your development environment.

2. Import the necessary classes and define the Lambda functions that will be used.

3. Call the `createCRUDLAPIGateway` function, providing the following parameters:
   - `scope`: The construction scope where the API Gateway will be created.
   - `props`: An object with the following properties:
     - `apiName`: The name of the API Gateway.
     - `baseResourceName`: The name of the base resource in the API (e.g., "/books").
     - `leafResourceName`: The name of the secondary resource (e.g., "/books/{bookId}").
     - `getAllBaseFunc`: The Lambda function to list items in the base resource.
     - `putItemBaseFunc`: The Lambda function to create or update items in the base resource.
     - `deleteItemBaseFunc`: The Lambda function to delete items in the base resource.
     - `getItemLeafFunc`: The Lambda function to retrieve a specific item in the secondary resource.
     - `userPoolClient`: The Cognito client to be used for authorization.

4. The `createCRUDLAPIGateway` function will create the API Gateway with GET, POST, PUT, and DELETE methods on the base resource, as well as the GET method on the secondary resource. Cognito authentication will be applied to these methods.

5. Deploy the infrastructure using AWS CDK to create the API Gateway and associated resources.

6. Configure authorization and authentication in Cognito as needed to secure your API endpoints.
