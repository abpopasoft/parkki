import {createParkingFacility} from "../../src/createFacility";
import {tokenVerify} from "../../src/tokenVerify";
import {AWS_REGION} from "../../src/settings";

const AWS = require('aws-sdk');
AWS.config.update({region: AWS_REGION});
const cognitoIdentityServiceProvider =
    new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
    });


export async function handler(event, context) {
    console.log("token = " + event.token);

    const claims = await tokenVerify(event.token);

    console.log(JSON.stringify(claims));
    event.owner = claims['cognito:username'];
    const userPoolId = claims.iss.slice(claims.iss.lastIndexOf('/') + 1);
    console.log(`poolId: ${userPoolId}, user: ${claims['cognito:username']}`);

    const userData = await new Promise((resolve, reject) => {
        cognitoIdentityServiceProvider.adminGetUser(
            {
                UserPoolId: userPoolId,
                Username: claims['cognito:username']//'foobar' //claims['cognito:username']
            },
            function (err, data) {
                if(err) {
                    console.log(`admin user err: ${err}`);
                    resolve (err)
                }
                console.log(`admin user: ${data}`);
                resolve(data)
            }
        );
    });

    console.log(userData);
    const userAttributes = userData.UserAttributes;
    const facilityIdsItem = userAttributes.find(element => element.Name === 'custom:parkingFacilityIds')
    const facilityIds = facilityIdsItem ? facilityIdsItem.Value: facilityIdsItem
    console.log("facility ids:" + facilityIds);
    console.log("facility id:" + event.id);

    if(facilityIds)
        event.idList = facilityIds.split(',');
    else
        event.idList = [];


    const facility = await createParkingFacility(event);
    console.log(facility);

    event.idList.push(facility.id);

    const updateRes = await new Promise((resolve, reject) => {
        cognitoIdentityServiceProvider.adminUpdateUserAttributes(
            {
                UserAttributes: [
                    {
                        Name: 'custom:parkingFacilityIds',
                        Value: event.idList.reduce((a, id) => `${a},${id}`)
                    }
                ],
                UserPoolId: userPoolId,
                Username: claims['cognito:username']
            },
            function (err, data) {
                if(err) {
                    console.log(`admin update err: ${err}`);
                    resolve (err)
                }
                console.log(`admin update: ${data}`);
                resolve(data)
            }
        );
    });

    console.log(`update: ${JSON.stringify(updateRes)}`);
    return facility
    // throw new Error("some error type");
}


