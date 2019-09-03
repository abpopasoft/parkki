
import * as fs from 'fs'

import * as parkingAreas from './prConnector'

import {ParkingFacility} from './schemas/parkingFacility'

import * as omiWriter from './omiwriter';
import {GeoCoordinates} from "./schemas/geoCoordinates";
import {ParkingSpace} from "./schemas/parkingSpace";
import {Capacity} from "./schemas/capacity";


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
    fs.writeFile('pr_areas_cache.json', JSON.stringify(Array.from(areas)), err => console.log(err));
    omiWriter.open().then(() => {
        let i = 0;
        console.log(areas)
        Array.from(areas).forEach(keyValuePair => {
            let [key, value] = keyValuePair;
            console.log("kvp:" + JSON.stringify(keyValuePair))

//            console.log(JSON.stringify(value));
            if (value.status === 'IN_OPERATION' && true /*|| key === "762c5a08-6ae8-4329-83a7-712548d6149a"  &&  value.capacityEstimate > 0  && value.currentUsageCount > 0 && i === 0*/ ) {
 //               console.log(JSON.stringify(value, null, 2));
                let geo = new GeoCoordinates(value.coordinate[0]+"", value.coordinate[1]+"", null);

                let capacities = [];

                    console.log(value.utilizations)

                if(value.cap['CAR'])
                    capacities.push(new Capacity('CarCapacity', 'Car', value.cap.CAR));

               // if(value.cap['DISABLED'])
               //     capacities.push(new Capacity('DisableCapacity', 'PersonsWithDisabledParkingPermit', value.cap.DISABLED));

                if(value.cap['BICYCLE'])
                    capacities.push(new Capacity('BicycleCapacity', 'Bicycle', value.cap.BICYCLE));

                let pf = new ParkingFacility(value.id, "HSY", geo, capacities, [], [], value.name);
                //                console.log(JSON.stringify(pf));
//                pf.getOdf()
//                console.log(JSON.stringify(pf.getOdf(), null, 2));
                omiWriter.write(pf.getOdf());
  //              console.log(JSON.stringify(pf.getOdf(), null, 2));
                i++;
                console.log(`${i}: id: ${value.id}, capacity: ${value.capacityEstimate}, usage: ${value.currentUsageCount}`)
            }
        });
    })
});
