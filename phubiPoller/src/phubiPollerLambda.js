// import fetch from 'node-fetch';
//
// import fs from 'fs';
//
import * as parkingAreas from '../../src/connector'

import * as AWS from 'aws-sdk';
import {ParkingFacility} from "../../src/schemas/parkingFacility";
import {ParkingSpace} from "../../src/schemas/parkingSpace";

const AWSaccessKeyId = 'not-important';
const AWSsecretAccessKey = 'not-important';
const AWSregion = 'local';
// const AWSendpoint = 'http://dynamodb:8000'; // This is required
const AWSendpoint = 'http://localstack:4569'; // This is required

AWS.config.update({
    accessKeyId: AWSaccessKeyId,
    secretAccessKey: AWSsecretAccessKey,
    region: AWSregion,
    endpoint: AWSendpoint
});

const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08', endpoint: 'http://localstack:4569'});
const sqs = new AWS.SQS({endpoint: 'http://localstack:4576'});


export  async function handler(event, context) {
    console.log("value1 = " + event.key1);
    console.log("value2 = " + event.key2);

    let currentPromise = parkingAreas.readStatistics();
    let currentStatistics = await currentPromise;

    if (currentStatistics.next != null) {
        // schedue next batch
        console.log(`Scheduling next batch ${currentStatistics.next}`)
    }

    let qp = new Promise(resolve => sqs.listQueues({}, (err, data) => {
        console.log(data)
        console.log(err)
        resolve()
    }));
    await qp;



    // let listTablesPromise = new Promise((resolve, reject) => {
    //         ddb.listTables((err, data) => {
    //             console.log(`LT: ${err}, D:${data}`);
    //             resolve(data);
    //         });
    //     }
    // );
    //
    // let tables = await listTablesPromise;
    // console.log(`TABLES ${tables}`);
    //
    // if (tables.TableNames.length === 0) {
    //     console.log("Create table");
    //     const tableCreationPromise = new Promise((resolve, reject) => {
    //
    //         const params = {
    //             AttributeDefinitions: [
    //                 {
    //                     AttributeName: 'parkingFacilityId',
    //                     AttributeType: 'S'
    //                 }
    //             ],
    //             KeySchema: [
    //                 {
    //                     AttributeName: "parkingFacilityId",
    //                     KeyType: "HASH"
    //                 }
    //             ],
    //             ProvisionedThroughput: {
    //                 ReadCapacityUnits: 5,
    //                 WriteCapacityUnits: 5
    //             },
    //             TableName: "phubi.state"
    //         };
    //
    //         ddb.createTable(params, (err, data) => {
    //             console.log(data);
    //             console.log(err);
    //             resolve(data);
    //         });
    //     });
    //     console.log(await tableCreationPromise)
    // }

    let handlers = currentStatistics.results.map(statistics => {
        const params = {
            ExpressionAttributeNames: {
                "#CUC": "currentUsageCount"
            },
            ExpressionAttributeValues: {
                ":cuc": {N: statistics.current_parking_count + ""}
            },
            Key: {
                "parkingFacilityId": {
                    S: statistics.id
                }
            },
            UpdateExpression: "SET #CUC = :cuc",
            ReturnValues: "ALL_OLD",
            TableName: 'phubi.state'
        };

        let resultPromise = new Promise((resolve, reject) => {
            ddb.updateItem(params, (err, data) => {
                if (err) {
                    console.log(err)
                }
                resolve({old: data, new: statistics});
            })
        });
        return resultPromise;
    });

    console.log(handlers);

    let f = new Promise(resolveT => {
        Promise.all(handlers).then(async results => {  // XXX: dont fail all
            results.forEach(async result => {
                if (!result.old.Attributes) {  // XXX extract function
                    console.log(`NEW ${result.new.id}`);
                    let params = {
                        MessageBody: JSON.stringify(result.new),
                        QueueUrl: 'http://localstack:4576/queue/phubi.newFacility'
                    };

                    let a = new Promise((resolve, reject) => {
                        sqs.sendMessage(params, (err, data) => {
                            if (err) reject(err);
                            resolve(data)
                            resolveT(data)
                        })
                    });
                    console.log(await a)
                } else if (result.old.Attributes.currentUsageCount.N != result.new.current_parking_count) {
                    let updateResult = await updatePhubiUsage(result.new, result.old.Attributes);
                    console.log(updateResult);
                }
            })
        }).catch(err => {
            console.log('EEE');
            console.log(err)
        });
    });

    console.log(await f);
    return "foo"
// return information to the caller.
};

function updatePhubiUsage(newUsage, oldUsage) {

    let parkingSpaces = [];

    for (let j = 0; j < oldUsage.capacityEstimate; j++) {
        parkingSpaces.push(new ParkingSpace(`space ${j}`, j >= newUsage.current_parking_count ? true : false))
    }
    return updateParkings(newUsage.parkingFacilityId, parkingSpaces);

    function updateParkings(id, spaces) {
        let parkingFacility = new ParkingFacility(id);
        parkingFacility.parkingSpaces = spaces;
        let odf = parkingFacility.getUpdateAvailableOdf();
        console.log(odf);

        let params = {
            MessageBody: JSON.stringify({odf}),
            QueueUrl: 'http://localstack:4576/queue/phubi.odfWrite'
        };

        let a = new Promise((resolve, reject) => {
            sqs.sendMessage(params, (err, data) => {
                if (err) reject(err);
                resolve(data)
                resolveT(data)
            })
        });

        return a;
        //omiWriter.write(odf);
    }

}
