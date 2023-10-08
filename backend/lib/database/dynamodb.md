# AWS CDK Service DynamoDB 

This AWS CDK service enables you to create a DynamoDB table for storing data in your AWS applications.

## Usage

Follow these steps to create a DynamoDB table using this AWS CDK service:

1. Ensure that you have AWS CDK and its dependencies installed in your development environment.

2. Import the necessary classes and define the properties for your DynamoDB table.

3. Call the `createBooksTable` function, providing the following parameters:
   - `scope`: The construction scope where the DynamoDB table will be created.
   - `props`: An object with the following property:
     - `tableName`: The name of the DynamoDB table.

4. The `createBooksTable` function will create a DynamoDB table with the specified configuration, including settings for billing mode, retention policy, and partition key.
