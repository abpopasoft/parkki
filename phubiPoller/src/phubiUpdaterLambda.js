import * as parkingAreas from '../../src/connector'


import * as AWS from 'aws-sdk';
import {ParkingFacility} from "../../src/schemas/parkingFacility";
import {GeoCoordinates} from "../../src/schemas/geoCoordinates";
import {ParkingSpace} from "../../src/schemas/parkingSpace";
import {AWS_REGION} from "../../src/settings";



const AWSaccessKeyId = 'not-important';
const AWSsecretAccessKey = 'not-important';
const AWSregion = AWS_REGION;
// const AWSendpoint = 'http://dynamodb:8000'; // This is required
const AWSendpoint = 'http://localstack:4569'; // This is required

const host = "localhost"
//const host = "localstack"


AWS.config.update({
    accessKeyId: AWSaccessKeyId,
    secretAccessKey: AWSsecretAccessKey,
    region: AWSregion,
    endpoint: AWSendpoint
});

const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08', endpoint: 'http://localstack:4569'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05', endpoint: 'http://localstack:4576'});

export async function handler(event, context) {


    let receicpHandles = [];
    let receivePromise = new Promise((resolve, reject) => {
        const params = {
            QueueUrl: 'http://localstack:4576/queue/phubi.newFacility',
            MaxNumberOfMessages: 5,
            AttributeNames: ['All']
        };

        sqs.receiveMessage(params, (err, data) => {
            console.log(err);
            console.log(data);
            let facilityIds = [];
            data.Messages.forEach(message => {
                const body = JSON.parse(message.Body);
                console.log(`facility: ${body.id}`);
                receicpHandles.push({Id: body.id, ReceiptHandle: message.ReceiptHandle});
                facilityIds.push(body.id);
            });
            resolve(facilityIds);

        })

    });

    let facilityIds = await receivePromise;
    console.log(facilityIds);

    let facilityPromises = facilityIds.map(facilityId => {
        return parkingAreas.readFacility(facilityId)
    });
    console.log(facilityPromises);
    console.log("facilityPromises");


    let aPromise = new Promise((res, rej) => {

        Promise.all(facilityPromises)
            .then(async facilities => {

                let updatePromises = facilities.map(facility => {
                    console.log("FF");
                    console.log(facility);

                    let facilityUpdatePromise = updateFacility(facility);
                    // XXX await for response

                    const params = {
                        ExpressionAttributeNames: {
                            "#PSC": "parkingSpaceCapacity",
                            "#PFLAT": "parkingFacilityLatitude",
                            "#PFLON": "parkingFacilityLongitude"
                        },
                        ExpressionAttributeValues: {
                            ":psc": {N: facility.properties.capacity_estime?facility.properties.capacity_estime:0 + ""},
                            ":pflat": {S: facility.geometry.coordinates[0][0][0][1] + ""},
                            ":pflon": {S: facility.geometry.coordinates[0][0][0][0] + ""}
                        },
                        Key: {
                            "parkingFacilityId": {
                                S: facility.id
                            }
                        },
                        UpdateExpression: "SET #PSC = :psc, #PFLAT = :pflat, #PFLON = :pflon",
                        ReturnValues: "ALL_OLD",
                        TableName: 'phubi.state'
                    };

                    let resultPromise = new Promise((resolve, reject) => {
                        ddb.updateItem(params, (err, data) => {
                            if (err) {
                                console.log(err)
                            }

                            resolve({old: data, new: facility});
                        })
                    });
                    console.log(facility);
                    return Promise.all([resultPromise, facilityUpdatePromise]);
                });

                res(Promise.all(updatePromises));

            })
            .catch(err => console.log(err))

    });

    console.log(await aPromise);

    let cleanQueuPromise = new Promise((resolve, reject) => {
        let params = {
            Entries: receicpHandles,
            QueueUrl: 'http://localstack:4576/queue/phubi.newFacility'
        };
        sqs.deleteMessageBatch(params, function(err, data) {
            if (err) {console.log(err, err.stack); reject(err)} // an error occurred
            else     {console.log(data); resolve(data)};           // successful response
        });

    });
    return await cleanQueuPromise;
};

function updateFacility(facility) {

    let geo = new GeoCoordinates(facility.geometry.coordinate[0], facility.geometry.coordinate[1], null);

    let parkingSpaces = [];
    for (let j = 0; j < facility.properties.capacityEstimate; j++) {
        parkingSpaces.push(new ParkingSpace("space " + j, j >= facility.currentUsageCount?true:false, 99, 2.5, 'Car', 5.0))
    }
    let pf = new ParkingFacility(value.id, "HEL", geo, [], parkingSpaces);

    let odf = pf.getOdf();
    console.log(odf);

    let params = {
        MessageBody: JSON.stringify({odf}),
        QueueUrl: 'http://localstack:4576/queue/phubi.odfWrite'
    };

    let a = new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
            resolveT(data)
        })
    });

    return a;

}

