import fetch from 'node-fetch'
import {OMI_ACCESS_TOKEN_HEADER, OMI_SERVER} from "./settings";
const omiServer = OMI_SERVER;
//const omiServer = 'http://192.168.1.163:8888';
//const omiServer = 'http://127.0.0.1:8888';


["1", "1006", "1009", "1037", "1047", "738", "747", "751", "755", "990", "992"]
    .forEach(id => {
        const deleteReq = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">\n' +
            '  <delete msgformat="odf">\n' +
            '    <msg>\n' +
            '      <Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">\n' +
            '        <Object>\n' +
            '          <id>ParkingService</id>\n' +
            '          <Object>\n' +
            '            <id>ParkingFacilities</id>\n' +
            '            <Object>\n' +
            '              <id>' + id + '</id>\n' +
            '            </Object>\n' +
            '          </Object>\n' +
            '        </Object>\n' +
            '      </Objects>\n' +
            '    </msg>\n' +
            '  </delete>\n' +
            '</omiEnvelope>'


        fetch(omiServer, {
            method: 'POST',
            body: deleteReq,
            headers: {
                Authorization: OMI_ACCESS_TOKEN_HEADER
            }
        }).then(res => {
            return res.text()
        }).then(text => {
            console.log(text)
        });
    })



