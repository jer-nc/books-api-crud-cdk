import { AuthorizationType, CfnAuthorizer, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

type CRUDLAPIGatewayProps = {
    apiName: string
    baseResourceName: string
    leafResourceName: string
    getAllBaseFunc: IFunction
    putItemBaseFunc: IFunction
    deleteItemBaseFunc: IFunction
    getItemLeafFunc: IFunction
    userPoolClient: any
}

export const createCRUDLAPIGateway = (scope: Construct, props: CRUDLAPIGatewayProps) => {
    const api = new RestApi(scope, props.apiName, {
        restApiName: props.apiName,
    })

    // This is the base resource for the API (/books)
    const baseResource = api.root.addResource(props.baseResourceName)
    // This is the leaf resource for the API (/books/{bookId})
    const leafResource = baseResource.addResource(`{${props.leafResourceName}}`)

    // Allow CORS for all methods
    baseResource.addCorsPreflight({
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
    })

    leafResource.addCorsPreflight({
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
    })

    // Lambda integrations for each method of the API resource (GET, POST, PUT, DELETE)
    const getAllBaseIntegration = new LambdaIntegration(props.getAllBaseFunc)
    const putItemBaseIntegration = new LambdaIntegration(props.putItemBaseFunc)
    const deleteItemBaseIntegration = new LambdaIntegration(props.deleteItemBaseFunc)
    const getItemLeafIntegration = new LambdaIntegration(props.getItemLeafFunc)

    // Add the PUT, POST and DELETE methods to the base resource
    // baseResource.addMethod('PUT', putItemBaseIntegration)
    // baseResource.addMethod('POST', putItemBaseIntegration)
    // baseResource.addMethod('DELETE', deleteItemBaseIntegration)

    const authorizer = new CfnAuthorizer(scope, 'CognitoAuthorizer', {
        restApiId: api.restApiId,
        name: 'CognitoAuthorizer',
        type: AuthorizationType.COGNITO,
        identitySource: 'method.request.header.Authorization',
        providerArns: [props.userPoolClient.userPoolArn],
    });

    // Add the GET method to the base resource
    baseResource.addMethod('GET', getAllBaseIntegration, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref
        }
    })

    // Add the POST method to the base resource with authorizer
    baseResource.addMethod('POST', putItemBaseIntegration, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref
        }
    })

    // Add the PUT method to the leaf resource with authorizer
    baseResource.addMethod('PUT', putItemBaseIntegration, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref
        }
    })


    // Add the DELETE method to the base resource with authorizer
    baseResource.addMethod('DELETE', deleteItemBaseIntegration, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref
        }
    })

    // Add the GET method to the leaf resource with authorizer 
    leafResource.addMethod('GET', getItemLeafIntegration, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref
        }
    })


    return api
}