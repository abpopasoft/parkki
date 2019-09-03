
//import * as fs from 'fs'

import * as parkingAreas from './connector'
import {ParkingFacility} from './schemas/parkingFacility'
import * as omiWriter from './omiwriter';
import {GeoCoordinates} from "./schemas/geoCoordinates";
import {ParkingSpace} from "./schemas/parkingSpace";
import {Capacity} from "./schemas/capacity";

let parseArgs = require('minimist');

const argv = parseArgs(process.argv.slice(2));
console.dir(argv);

let omiserver = 'http://127.0.0.1:8080'
if(argv['_'].length === 1){
    omiserver = argv['_'][0]
}
/*
let omiWriter = {
    open() {
            return Promise.resolve()
    },
    write(data) {
              console.log(data)
    }
};
*/

parkingAreas.readAll().then(areas => {
    //    fs.writeFile('areas_cache.json', JSON.stringify(Array.from(areas)), err => console.log(err));
    omiWriter.open(omiserver).then(() => {
        let i = 0;
        Array.from(areas).forEach(keyValuePair => {
            let [key, value] = keyValuePair;
            if (/*true || key === "762c5a08-6ae8-4329-83a7-712548d6149a"  && */ value.capacityEstimate > 0  /*&& value.currentUsageCount > 0 && i === 0*/ ) {
//                console.log(JSON.stringify(value, null, 2));
                console.log("KEY: " + key + " Value: " + JSON.stringify(value))
                let geo = new GeoCoordinates(value.coordinate[0], value.coordinate[1], null);
                let parkingSpaces = [];
                for (let j = 0; j < value.capacityEstimate; j++) {
                    parkingSpaces.push(new ParkingSpace("space " + j, j >= value.currentUsageCount?true:false, 99, 2.5, 'Car', 5.0))
                }
                let capacities = [];
                capacities.push(new Capacity('CarCapacity', 'Car', value.capacityEstimate));

                let pf = new ParkingFacility(value.id, "HEL", geo, capacities, parkingSpaces);
//                console.log(JSON.stringify(pf))
                omiWriter.write(pf.getOdf());
//                console.log(JSON.stringify(pf.getOdf(), null, 2));
                i++;
                console.log(`${i}: id: ${value.id}, capacity: ${value.capacityEstimate}, usage: ${value.currentUsageCount}`)
            }
        });
    })
});
