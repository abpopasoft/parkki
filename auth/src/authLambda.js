import {AWS_REGION, AWS_USER_POOL_ID, OMI_ACCESS_TOKEN} from "../../src/settings";

const AWS = require('aws-sdk');

const USER_POOL_ID = AWS_USER_POOL_ID;

AWS.config.update({region: AWS_REGION});
const cognitoIdentityServiceProvider =
    new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
    });


export async function handler(event, context) {
    let token;
    let username;
    if (event.body) {
        let body = JSON.parse(event.body);
        if (body.token)
            token = body.token;
        if (body.username)
            username = body.username;
    }

    let responseBody = {
        denied: ['Objects'],
        allowed: []
    };

    if (token === OMI_ACCESS_TOKEN) {
        responseBody = {
            denied: [],
            allowed: ['Objects']
        }
    } else if (username) {
        const userData = await new Promise((resolve, reject) => {
            cognitoIdentityServiceProvider.adminGetUser(
                {
                    UserPoolId: USER_POOL_ID,
                    Username: username
                },
                (err, data) => {
                    if (err) {
                        console.log(`adminGetUser err: ${err}`);
                        resolve(err)
                    }
                    resolve(data)
                })
        });

        const userAttributes = userData.UserAttributes;
        const facilityIdsItem = userAttributes.find(element => element.Name === 'custom:parkingFacilityIds');
        const facilityIds = facilityIdsItem ? facilityIdsItem.Value : facilityIdsItem;
        console.log("facility ids:" + facilityIds);

        let idList = [];
        if (facilityIds)
            idList = facilityIds.split(',');

        responseBody = {
            denied: [],
            allowed: idList.map(id => {
                return `Objects/ParkingService/ParkingFacilities/${id}`
            })
        }

    }

    const response = {
        "statusCode": 200,
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };

    return Promise.resolve(response)
}
