import * as fs from 'fs'

import fetch from 'node-fetch';

const pLimit = require('p-limit');
const limiter = pLimit(2);

export function readAll() {

    function readFile(name) {
        return new Promise((resolve, reject) => {
            fs.readFile(name, (err, data) => {
                if (err)
                    reject(err);
                resolve(JSON.parse(data))
            });
        })
    }


    let parkingFacilities = new Map();

    let parkingAreaPromise = fetch('https://p.hsl.fi/api/v1/facilities.geojson')
        .then(res => res.json())
        //            let parkingAreaPromise = readFile('test/parking_area_reply2.json')
        .then(facilityList => {
            return new Promise((resolve, reject) => {
                console.log(`has more: ${facilityList.hasMore}`);
                fs.writeFile('prFacilities.json', JSON.stringify(facilityList), err => console.log(err));
                facilityList.features.forEach(feature => {
                    let capacityEstimate = feature.properties.builtCapacity.CAR;
                    let id = "PR_" + feature.id;
                    let origId = feature.id;
                    let coordinate = feature.geometry.coordinates[0][0];
                    console.log(JSON.stringify(coordinate));
                    let status = feature.properties.status;

                    let cap = feature.properties.builtCapacity;
                    let name = feature.properties.name.fi;
                    parkingFacilities.set(feature.id, {id, origId, cap, coordinate, status, name});
                    console.log(`facility: ${id}: ${feature.properties.name.fi}, est ${JSON.stringify(cap)}, status ${status}`)
                });
                resolve(parkingFacilities);
            })
        });

    return parkingAreaPromise;

    function disabled_too() {

        return new Promise(resolve => {
            parkingAreaPromise.then(parkingFacilities => {
                    return new Promise(resolve => {
                            console.log("-----")
                            let all = Array.from(parkingFacilities.values()).map(facility => {
                                console.log(facility)
                                if (true || facility.cap['CAR'] || facility.cap['ELECTRIC_CAR'] || facility.cap['DISABLED']) {
                                    limiter(() => {
                                        return fetch(`https://p.hsl.fi/api/v1/facilities/${facility.origId}/utilization`)
                                            .then(reply => {/*console.log(reply); */
                                                return reply.json()
                                            })
                                            .then(utilizations => {

                                                const parkingFacility = parkingFacilities.get(facility.origId);
                                                console.log("PF:" + parkingFacility)
                                                console.log("UU:" + utilizations);
                                                parkingFacility.utilization = {};
                                                utilizations.forEach(utilization => {
                                                    // console.log(`facility: ${facility.id}: ${facility.name}: ${utilization.capacityType}: `
                                                    //     + `${utilization.usage} ${utilization.spacesAvailable} / ${utilization.capacity}`
                                                    //     + `${JSON.stringify(facility.cap)} / ${JSON.stringify(utilization)}.`)

                                                    console.log(faciity.id + ": " + utilization.capacityType + ":" + utilization.spacesAvailable);
                                                    parkingFacility.utilization[utilization.capacityType] = utilization.spacesAvailable
                                                })
                                                resolve();
                                            })
                                    })
                                } else {
                                    resolve();
                                }
                            });
                            Promise.all(all)
                        }
                    )

                }
            ).then(() => resolve(parkingFacilities))
        })
    }
}
function disabled() {
//let parkingStatisticsPromise = fetch('https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/?format=json&page_size=1830')
//    .then(res => res.json());
    let parkingStatisticsPromise = readFile('test/parking_area_statistics_reply2.json');

    return Promise.all([parkingAreaPromise, parkingStatisticsPromise])
        .then(([parkingAreas, parkingStatistics]) => {

            console.log(parkingStatistics.count);
            console.log(parkingStatistics.next);

            fs.writeFile('parking_area_statistics_reply2.json', JSON.stringify(parkingStatistics), err => console.log(err));

            parkingStatistics.results.forEach(statistic => {
                let parkingArea = parkingAreas.get(statistic.id);
                parkingArea.currentUsageCount = statistic.current_parking_count;
            });

            return Promise.resolve(parkingAreas);
        })
        .catch(err => {
            console.log(err);
            return Promise.reject(err)
        });

    //   }
}


//readAll();

// export function readStatistics() {
//     return fetch('https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/?format=json&page_size=5&page=1')
//         .then(res => res.json())
//         .catch(err => console.log(`ERR: ${err}`));
// }
//
// export function readFacility(facilityId) {
//     let url = `https://pubapi.parkkiopas.fi/public/v1/parking_area/${facilityId}/?format=json`;
//     console.log(url);
//     return fetch(url)
//         .then(res => res.json())
//         .catch(err => console.log(`ERR: ${err}`));


// .then(res => {
//     console.log(res);
//     if(res.ok)
//         res.json();
//     Promise.reject(res.message)
// })
// .catch(err => {console.log(err); Promise.reject(err)})

//}