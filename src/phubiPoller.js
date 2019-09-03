import fetch from 'node-fetch';
import {OMI_ACCESS_TOKEN_HEADER, OMI_SERVER} from "./settings";

const PHUBI_SERVER = "https://pubapi.parkkiopas.fi";
const UTILIZATION_START = "/public/v1/parking_area_statistics/?format=json&page_size=5&page=365";


export function poll(url = (PHUBI_SERVER + UTILIZATION_START)) {
    return fetch(url)
        .then(reply => {
            if (reply.ok)
                return reply.json()
        })
        .then(reply => {

            const results = reply.results;
            results.forEach(utilization => {
                const {id, current_parking_count} = utilization;
                console.log(id + ": " + current_parking_count);
//                updateFacility("PR_" + facilityId, utilization)
            });
            return reply.next
        });
}


poll().then(r => console.log(r));

const accessToken = OMI_ACCESS_TOKEN_HEADER;

const capacityIds = {
    CAR: "CarCapacity"
};

function updateFacility(id, utilization) {
    const {facilityId, capacityType, usage, timestamp, spacesAvailable, capacity, openNow} = utilization;

    const capacityObjectId = capacityIds[capacityType]

    if (capacityObjectId) {
        const writeReq = `<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">
  <write msgformat="odf">
    <msg>
      <Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">
        <Object>
          <id>ParkingService</id>
          <Object>
            <id>ParkingFacilities</id>
            <Object type="mv:ParkingFacility">
              <id>${id}</id>
              <Object>
                <id>Capacities</id>
                <Object>
                  <id>${capacityObjectId}</id>
                  <InfoItem name="realTimeValue">
                    <value>${spacesAvailable}</value>
                  </InfoItem>
                  <InfoItem name="maximumValue">
                    <value>${capacity}</value>
                  </InfoItem>
                </Object>
              </Object>
            </Object>
          </Object>
        </Object>
      </Objects>
    </msg>
  </write>
</omiEnvelope>`;

        fetch(OMI_SERVER, {
            method: 'POST',
            body: writeReq,
            headers: {
                Authorization: OMI_ACCESS_TOKEN_HEADER
            }
        }).then(res => {
            return res.text()
        }).then(text => {
            console.log(`${id}: ${text}`)
        });
    }
}
