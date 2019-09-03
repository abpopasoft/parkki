import {OMI_SERVER} from "./settings";

let fs = require('fs');
let pLimit = require('p-limit');
let WebSocket = require('ws');
let host = 'ws://localhost:8888';
//let host = OMI_SERVER;

let omiConnection;
let onFly = [];

let onFlyCount = 0;
let sendCount = 0;
let rcvCount = 0;

let limitFunc = pLimit(2);

console.log("start");
function findParkings() {
    open().then(connection => {
        write("foo");
    })
}

findParkings();

export function open() {
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
                console.log(new Date())

                console.log(`onFly ${onFly.length}, rcvCount ${rcvCount}, data.length ${data.length}`);
                fs.writeFileSync("fpReply", data);
                console.log(new Date())

            });

            omiConnection.on('error', err => {
                console.log("********on error: " + err)

            });
            function noop(){};
            let ping = setInterval(function() {
                 omiConnection.ping(noop);
                 console.log("ping");
             }, 3000);

            resolve();
        })
    })
}


let promises = [];

let actions = [];

export function write(odf) {
    let omiEnvelope = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0">\n' +
        '<call msgformat="odf">\n' +
        '<msg>\n' +
        '<Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/">\n' +
        '<Object>\n' +
        '<id>ParkingService</id>\n' +
        '<InfoItem name="FindParking">\n' +
        '<value unixTime="1503488290" type="odf" dateTime="2017-08-23T14:38:10.575+03:00">\n' +
        '<Objects>\n' +
        '<Object type="FindParkingRequest">\n' +
        '<id>Parameters</id>\n' +
        '<description lang="English">List of possible parameters to request.</description>\n' +
        '<InfoItem type="schema:Distance" name="DistanceFromDestination" required="true">\n' +
        '<value unixTime="1503488290" dateTime="2017-08-23T14:38:10.575+03:00">10000</value>\n' +
        '</InfoItem>\n' +
        '<Object required="true" type="schema:GeoCoordinates">\n' +
        '<id>Destination</id>\n' +
        '<InfoItem name="latitude" required="true">\n' +
        '<value unixTime="1503488290" type="xs:double" dateTime="2017-08-23T14:38:10.575+03:00">60.1547151</value>\n' +
        '</InfoItem>\n' +
        '<InfoItem name="longitude" required="true">\n' +
        '<value unixTime="1503488290" type="xs:double" dateTime="2017-08-23T14:38:10.575+03:00">24.9440596</value>\n' +
        '</InfoItem>\n' +
        '</Object>\n' +
        '<Object required="true" type="mv:ElectricVehicle">\n' +
        '<id>Vehicle</id>\n' +
        '</Object>\n' +
        '</Object>\n' +
        '</Objects>\n' +
        '</value>\n' +
        '</InfoItem>\n' +
        '</Object>\n' +
        '</Objects>\n' +
        '</msg>\n' +
        '</call>\n' +
        '</omiEnvelope>';

    console.log(new Date())
    limitFunc(() => {
        return new Promise((resolve, reject) => {
            omiConnection.send(omiEnvelope, err => {
                sendCount++;
                console.log(`send ${sendCount}: ${err}`);
            });
            onFly.push({resolve, reject})
        })
    })
}



