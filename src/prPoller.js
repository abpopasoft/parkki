import fetch from 'node-fetch';
import {OMI_ACCESS_TOKEN_HEADER, OMI_SERVER} from "./settings";

const PR_SERVER = "https://p.hsl.fi";
const LAST_UTILIZATION_API = "/api/v1/utilizations";

export function poll() {
    fetch(PR_SERVER + LAST_UTILIZATION_API)
        .then(reply => {
            if (reply.ok)
                return reply.json()
        })
        .then(reply => {
            reply.forEach(utilization => {
                const {facilityId, capacityType, usage, timestamp, spacesAvailable, capacity, openNow} = utilization;
                updateFacility("PR_" + facilityId, utilization)
            })
        });
}

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
