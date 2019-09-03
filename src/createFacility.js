import {ParkingFacility} from './schemas/parkingFacility'
import {GeoCoordinates} from "./schemas/geoCoordinates";
import {Capacity} from "./schemas/capacity";
import {ParkingSpace} from "./schemas/parkingSpace";
import * as omiWriter from "./omiwriter";
import * as uuid from 'uuid/v4'
import {OMI_SERVER} from "./settings";
//const OMI_SERVER = "http://127.0.0.1:8888";

export async function createParkingFacility(facilityProperties) {
    await omiWriter.open(OMI_SERVER);

    let facilityId;
    if(facilityProperties.id) {
        if( ! facilityProperties.idList.find(id => id === facilityProperties.id)) {
            throw new Error("Nope")
        }
    } else {
        facilityId = "r_" + uuid.default();
        console.log("idlist. " + facilityProperties.idList)
        facilityProperties.idList=facilityProperties.idList||[]
 //       facilityProperties.idList.add(facilityId);
    }

    facilityProperties.id = facilityId;

    const parkingSpaceList = facilityProperties.parkingSpaces;

    const geo = new GeoCoordinates(facilityProperties.geo.longitude,
        facilityProperties.geo.latitude, null);
    const capacities = [new Capacity('CarCapacity', 'Car', 1)];

    const parkingSpaces = parkingSpaceList.map(parkingSpace => {
        return new ParkingSpace(parkingSpace.id,
            parkingSpace.available,
            parkingSpace.heightLimit,
            parkingSpace.widthLimit,
            parkingSpace.validFor,
            parkingSpace.lenghtLimit);
    });

    const openingHoursSpecifications = [];
    const name = facilityProperties.name;
    const parkingFacility = new ParkingFacility(facilityId, facilityProperties.owner,
        geo, capacities, parkingSpaces, openingHoursSpecifications, name);

    const odf = parkingFacility.getOdf();

    await omiWriter.write(odf);

    console.log(facilityId);
    return facilityProperties;
}


