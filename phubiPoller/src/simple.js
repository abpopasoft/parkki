import * as parkingAreas from '../../src/connector'

import * as AWS from 'aws-sdk'
import fetch from "node-fetch";
import {AWS_REGION, OMI_ACCESS_TOKEN_HEADER, OMI_SERVER} from "../../src/settings";

AWS.config.update({region: AWS_REGION});

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

export async function handler(event, context) {
    console.log(`AWS ${AWS}, ddb ${ddb}`);
    console.log(event);

    const areas = await parkingAreas.readAll();

    let i = 0;
    const updates = Array.from(areas).map(async keyvaluePair => {
        let [key, value] = keyvaluePair;
        if (value.capacityEstimate > 0) {
//            console.log(`facility ID: ${value.id}`);
            const params = {
                TableName: 'omicache',
                Item: {
                    provider: {S: 'phubi'},
                    facilityid: {S: value.id},
                    capacityEstimate: {N: value.capacityEstimate + ""},
                    currentUsageCount: {N: value.currentUsageCount + ""}
                },
                ReturnValues: 'ALL_OLD'

            };
            return new Promise((resolve, reject) => {
//                console.log(`ddb putting`);
                ddb.putItem(params, (err, data) => {
                    if (err) {
                        console.log("DDB Error", err);
                        reject(err);
                    } else {
//                        console.log("DDB Success", data);
                        resolve(data)
                    }
                });
            });
        }
        return Promise.resolve('skip');
    });

    console.log(updates.length);

    const updated = await Promise.all(updates);

    const written = updated.map(oldValue => {
        const attributes = oldValue.Attributes;
        if (attributes) {
            const facilityId = attributes.facilityid.S;

            const current = areas.get(facilityId);
            if (current) {
                if (current.currentUsageCount != attributes.currentUsageCount.N) {
                    console.log(`Update: ${facilityId} ${attributes.currentUsageCount.N} -> ${current.currentUsageCount}`)
                    return updateFacility(facilityId, current.currentUsageCount, current.capacityEstimate)
                }
            }

        }
        return Promise.resolve('skip');

    });

    return new Promise(resolve => {
        Promise.all(written).then(val => {
            console.log(val.length);
            resolve(val.length);
        })

    })

}


function updateFacility(facilityId, currentUsage, capacity) {


    const writeReq = `<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">
  <write msgformat="odf">
    <msg>
      <Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">
        <Object>
          <id>ParkingService</id>
          <Object>
            <id>ParkingFacilities</id>
            <Object type="mv:ParkingFacility">
              <id>${facilityId}</id>
              <Object>
                <id>ParkingSpaces</id>
                ${
                    Array.from({length: capacity}, (v, i) => i).map(val => {
                            return `<Object>
                                        <id>space ${val}</id>
                                        <InfoItem name="available">
                                            <value>${val > currentUsage}</value>
                                        </InfoItem>
                                    </Object>`
                            }).reduce((objs, item) => objs + item)
                }
              </Object>
              <Object>
                <id>Capacities</id>
                <Object>
                  <id>CarCapacity</id>
                  <InfoItem name="maximumValue">
                    <value>${capacity}</value>
                  </InfoItem>
                  <InfoItem name="realTimeValue">
                    <value>${capacity - currentUsage}</value>
                  </InfoItem>
                </Object>
              </Object>
            </Object>
          </Object>
        </Object>
       </Objects>
     </msg>
   </write>
   </omiEnvelope>`

    return fetch(OMI_SERVER, {
        method: 'POST',
        body: writeReq,
        headers: {
            Authorization: OMI_ACCESS_TOKEN_HEADER
        }
    }).then(res => {
        return res.text()
    }).then(text => {
        console.log(`omi write ${text}`)
        return `${text}`
    });}