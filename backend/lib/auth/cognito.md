# AWS CDK Service for Creating Cognito User Pools

This AWS CDK service enables you to create a Cognito User Pool for managing user authentication and authorization in your AWS applications.

## Usage

To use this AWS CDK service, follow these steps:

1. Ensure that you have AWS CDK and its dependencies installed in your development environment.

2. Import the necessary classes and define the properties for the Cognito User Pool.

3. Call the `createCognitoPool` function, providing the following parameters:
   - `scope`: The construction scope where the Cognito User Pool will be created.
   - `props`: An object with the following property:
     - `poolName`: The name of the Cognito User Pool.

4. The `createCognitoPool` function will create a Cognito User Pool with the specified configuration, including self-sign-up, email verification, and password policy settings.

5. A User Pool Client and a User Pool Domain will also be created, allowing your API clients to interact with the User Pool for sign-in and sign-up.


