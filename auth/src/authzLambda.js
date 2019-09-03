import {tokenVerify} from "../../src/tokenVerify";
import {AWS_REGION, OMI_ACCESS_TOKEN} from "../../src/settings";

const AWS = require('aws-sdk');

AWS.config.update({region: AWS_REGION});
const cognitoIdentityServiceProvider =
    new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
    });

export async function handler(event, context) {
    let token;
    if (event.body) {
        let body = JSON.parse(event.body);
        if (body.token)
            token = body.token;
    }

    let claims = {};
    if (token === OMI_ACCESS_TOKEN) {
        claims['cognito:username'] = 'admin'
    } else {
        try {
            claims = await tokenVerify(token);
        } catch (e) {
            console.log(`token verify error: ${e}`);
            throw e;
        }
    }
    const userName = claims['cognito:username'];
    const responseBody = {
        email: userName,
        isAdmin: token === OMI_ACCESS_TOKEN
    };

    const response = {
        "statusCode": 200,
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };

    return Promise.resolve(response);
}