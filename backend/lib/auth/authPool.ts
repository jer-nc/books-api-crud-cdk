import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from "constructs";

type PoolProps = {
    poolName: string
}

// Create the Cognito User Pool
export const createCognitoPool = (scope: Construct, props: PoolProps) => {
    const userPool = new cognito.UserPool(scope, `${props.poolName}`, {
        userPoolName: `${props.poolName}`,
        selfSignUpEnabled: true,
        autoVerify: {
            email: true,
        },
        signInAliases: {
            email: true,
        },
        passwordPolicy: {
            minLength: 8,
            requireLowercase: false,
            requireUppercase: false,
            requireDigits: false,
            requireSymbols: false,
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    // Create a User Pool Client for the API to use for sign in and sign up
    const publicAppClient = userPool.addClient('PublicAppClient', {
        authFlows: {
            userSrp: true,
        },
        oAuth: {
            flows: {
                authorizationCodeGrant: true, 
            },
            scopes: [
                cognito.OAuthScope.OPENID,
            ],
        },
    });

    // Create a User Pool Domain for the API Client to use for sign in and sign up
    const domain = userPool.addDomain('BooksDomain', {
        cognitoDomain: {
            domainPrefix: 'booksapi',
        },
    });

    return userPool;
}
