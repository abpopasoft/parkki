
let odf = require('../mappings/odf').odf;
let Jsonix = require('jsonix').Jsonix;
let fs = require('fs');

let context = new Jsonix.Context([odf]);

let unmarshaller = context.createUnmarshaller();
let marshaller = context.createMarshaller();

let inputs = [
    "parkingAgent_ODF_Reply.xml",
    "parkingFacility.xml",
    "parkingSpaces.xml",
    "parkingSpace.xml",
    "geoCoordinates.xml",
    "openingHoursSpecifications.xml",
    "openingHoursSpecification.xml",
    "capacities.xml",
    "capacity.xml"
];

inputs.forEach(fileName => {
   unmarshaller.unmarshalFile("test/" + fileName, object => {
       console.log(fileName);
//       console.log(JSON.stringify(object, null, 2))

       fs.writeFile("src/schemas/jsObjects/" + fileName + ".json", JSON.stringify(object, null, 2), err => {
           if (err) throw err;

       })

   })

});

// unmarshaller.unmarshalURL('file:./test/parkingAgent_ODF_Reply.xml', unmarshalled => {
//     console.log(unmarshalled)
//
//     let xmlString =  marshaller.marshalString(unmarshalled);
//
//     console.log(xmlString)
//
// });

