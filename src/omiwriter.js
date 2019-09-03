import fetch from "node-fetch";
import {OMI_ACCESS_TOKEN_HEADER, OMI_SERVER} from "./settings";

let odf = require('./mappings/odf').odf;
let Jsonix = require('jsonix').Jsonix;

let fs = require('fs');

let pLimit = require('p-limit');

let WebSocket = require('ws');

let context = new Jsonix.Context([odf]);
let marshaller = context.createMarshaller();
let host = 'ws://localhost:8888';

let omiConnection;
let onFly = [];

let onFlyCount = 0;
let sendCount = 0;
let rcvCount = 0;

let limitFunc = pLimit(1);

let omiServer = "";

export function open(server) {

    omiServer = server;
    return Promise.resolve();
}


export function open_() {
    return new Promise((resolve, reject) => {
        omiConnection = new WebSocket(host);
        omiConnection.on('open', () => {

            omiConnection.on('message', (data, flags) => {
                let fly = onFly[0];
                if (fly)
                    fly.resolve();
                onFly.shift();
                onFlyCount--;
                rcvCount++;
                console.log(`onFly ${onFly.length}, rcvCount ${rcvCount}`);
            });

            omiConnection.on('error', err => {
                console.log("********on error: " + err)

            });
            resolve();
        })
    })
}


let promises = [];

let actions = [];

export function write(odf) {

    let parkingFacilityXmlString = marshaller.marshalString(odf);

    let omiEnvelope = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">\n' +
        '  <write msgformat="odf">\n' +
        '    <msg>\n' +
        '      <Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">\n' +
        '        <Object>\n' +
        '          <id>ParkingService</id>\n' +
        '          <Object>\n' +
        '            <id>ParkingFacilities</id>\n' +
        parkingFacilityXmlString +
        '          </Object>\n' +
        '        </Object>\n' +
        '      </Objects>\n' +
        '    </msg>\n' +
        '  </write>\n' +
        '</omiEnvelope>\n';

//     const omiServer = OMI_SERVER;
//    const omiServer = 'http://192.168.1.163:8888';

    console.log(`writer: ${omiServer}`)
    return limitFunc(() => {
        return new Promise(resolve => {

            sendCount++;
            console.log("start fetch");
            fetch(omiServer, {
                method: 'POST',
                body: omiEnvelope,
                headers: {
                    Authorization: OMI_ACCESS_TOKEN_HEADER
                }
            }).then(res => {
                console.log("fetch done")
                return res.text()
            }).then(text => {
                console.log(sendCount + ": " + text)
                resolve(text)
            });
        })
    });

    // limitFunc(() => {
    //     return new Promise((resolve, reject) => {
    //         omiConnection.send(omiEnvelope, err => {
    //             sendCount++;
    //             console.log(`send ${sendCount}: ${err}`);
    //         });
    //         onFly.push({resolve, reject})
    //     })
    // })
}


function notUsed() {
    let parkingFacilityJsonFile = 'src/schemas/jsObjects/parkingFacility.xml.json';
    fs.readFile(parkingFacilityJsonFile, (err, parkingFacilityJson) => {
        if (err) throw err;
        let parkingFacility = JSON.parse(parkingFacilityJson);
        let parkingFacilityXmlString = marshaller.marshalString(parkingFacility);

        omiConnection.on('open', () => {
            let omiEnvelope = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">\n' +
                '  <write msgformat="odf">\n' +
                '    <msg>\n' +
                '      <Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">\n' +
                '        <Object>\n' +
                '          <id>ParkingService</id>\n' +
                '          <Object>\n' +
                '            <id>ParkingFacilities</id>\n' +
                parkingFacilityXmlString +
                '          </Object>\n' +
                '        </Object>\n' +
                '      </Objects>\n' +
                '    </msg>\n' +
                '  </write>\n' +
                '</omiEnvelope>\n';

            console.log("sending..")
            omiConnection.send(omiEnvelope, err => {
                console.log("send err: ", err);
            });
        })
    });
}