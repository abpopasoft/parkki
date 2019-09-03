import * as parkingAreas from './connector'

import {ParkingFacility} from './schemas/parkingFacility'

import * as omiWriter from './omiwriter';
import {GeoCoordinates} from "./schemas/geoCoordinates";
import {ParkingSpace} from "./schemas/parkingSpace";

import * as fs from 'fs'

let cachePromise = new Promise((resolve, reject) => {
    fs.readFile('areas_cache.json', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data))
    })
});


let currentPromise = parkingAreas.readStatistics();


let odf = require('./mappings/odf').odf;
let Jsonix = require('jsonix').Jsonix;
let context = new Jsonix.Context([odf]);
let marshaller = context.createMarshaller();


Promise.all([currentPromise, cachePromise]).then(([data, previousAsArray]) => {
    let previous = new Map(previousAsArray);

    omiWriter.open().then(() => {
        let i = 0;
        data.results.forEach(stat => {

            let lastUsage = previous.get(stat.id);

            if (lastUsage && lastUsage.capacityEstimate) {
                if (lastUsage.currentUsageCount === stat.current_parking_count) {
                    // console.log(`same ${stat.id}`)
                } else {

                    let parkingSpaces = [];

                    for (let j = 0; j < lastUsage.capacityEstimate; j++) {
                        parkingSpaces.push(new ParkingSpace("space " + j, j >= lastUsage.currentUsageCount ? true : false))
                    }

                    if (i < 3)
                        updateParkings(stat.id, parkingSpaces)
                    i++;
                }

            } else {
                console.log(`NEW ${stat.id}`)
            }

        });

        function updateParkings(id, spaces) {
            let parkingFacility = new ParkingFacility(id);

            parkingFacility.parkingSpaces = spaces;

            let odf = parkingFacility.getUpdateAvailableOdf();
            console.log(odf);

            let parkingFacilityXmlString = marshaller.marshalString(odf);

            console.log(parkingFacilityXmlString)

            omiWriter.write(odf);
        }
    })
});
