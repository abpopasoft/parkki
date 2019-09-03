import {tokenVerify} from "../../src/tokenVerify";
import {AWS_REGION} from "../../src/settings";


const AWS = require('aws-sdk');
AWS.config.update({region: AWS_REGION});
const cognitoIdentityServiceProvider =
    new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
    });


export async function handler(event, context) {

    console.log(`event =  ${JSON.stringify(event)}`);

    const token = event.params.header.Authorization;
    let claims = {};
    try {
        claims = await tokenVerify(token);

    } catch (e) {
        console.log("token error");
        console.log(e);
        throw e
    }

    console.log(JSON.stringify(claims));
    event.owner = claims['cognito:username'];
    const userPoolId = claims.iss.slice(claims.iss.lastIndexOf('/') + 1);
    console.log(`poolId: ${userPoolId}, user: ${claims['cognito:username']}`);

    const userData = await new Promise((resolve, reject) => {
        cognitoIdentityServiceProvider.adminGetUser(
            {
                UserPoolId: userPoolId,
                Username: claims['cognito:username']
            },
            function (err, data) {
                if(err) {
                    console.log(`admin user err ${err}`)
                    resolve (err)
                }
                console.log(`admin user ${data}`)
                resolve(data)
            }
        );
    });

    console.log(userData);
    const userAttributes = userData.UserAttributes;
    const facilityIdsItem = userAttributes.find(element => element.Name === 'custom:parkingFacilityIds')
    const facilityIds = facilityIdsItem ? facilityIdsItem.Value: ""
    console.log(facilityIds);

    event.facilityIds = facilityIds.split(',');
    return event;


}