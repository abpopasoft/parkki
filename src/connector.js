//import * as fs from 'fs'

//const fs = require('fs');
import  fetch from 'node-fetch';

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


let parkingAreaPromise = fetch('https://pubapi.parkkiopas.fi/public/v1/parking_area/?format=json&page_size=1830')
    .then(res => res.json())
//    let parkingAreaPromise = readFile('test/parking_area_reply2.json')
        .then(parkingAreaList => {
            return new Promise((resolve, reject) => {
                console.log(parkingAreaList.count);
                console.log(parkingAreaList.next);
//            fs.writeFile('parking_area_reply2.json', JSON.stringify(parkingAreaList), err => console.log(err));
                let parkingAreas = new Map();
                parkingAreaList.features.forEach(feature => {
                    let capacityEstimate = feature.properties.capacity_estimate;
                    let id = feature.id;
                    let coordinate = feature.geometry.coordinates[0][0][0];
                    parkingAreas.set(feature.id, {id, capacityEstimate, coordinate})
                });
                resolve(parkingAreas);
            })
        });

let parkingStatisticsPromise = fetch('https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/?format=json&page_size=1830')
    .then(res => res.json());
//    let parkingStatisticsPromise = readFile('test/parking_area_statistics_reply2.json');

    return Promise.all([parkingAreaPromise, parkingStatisticsPromise])
        .then(([parkingAreas, parkingStatistics]) => {
            console.log(parkingStatistics.count);
            console.log(parkingStatistics.next);
//             fs.writeFile('parking_area_statistics_reply2.json', JSON.stringify(parkingStatistics), err => console.log(err));
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
}


export function readStatistics() {
    return fetch('https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/?format=json&page_size=5&page=1')
        .then(res => res.json())
        .catch(err => console.log(`ERR: ${err}`));
}

export function readFacility(facilityId) {
    let url = `https://pubapi.parkkiopas.fi/public/v1/parking_area/${facilityId}/?format=json`;
    console.log(url);
    return fetch(url)
        .then(res => res.json())
        .catch(err => console.log(`ERR: ${err}`));
}