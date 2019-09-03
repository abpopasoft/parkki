
export class ParkingFacility {

    constructor(id, ownedBy, geo, capacities = [], parkingSpaces = [], openingHoursSpecifications = [], name) {
        this.id = id +"";
        this.owneBy = ownedBy;
        this.geo = geo;
        this.capacities = capacities;
        this.parkingSpaces = parkingSpaces;
        this.openingHoursSpecifications = openingHoursSpecifications;
        this.name = name
    }

    getUpdateAvailableOdf() {
        return {
            name: {
                namespaceURI: "",
                localPart: "Object",
                prefix: "",
                key: "Object",
                string: "Object"
            },
            value: {
                TYPE_NAME: "odf.ObjectType",
                type: "mv:ParkingFacility",
                otherAttributes: {
                    type: "mv:ParkingFacility"
                },
                id: [
                    {
                        TYPE_NAME: "odf.QlmID",
                        value: this.id
                    }
                ],
                object: [
                    {
                        TYPE_NAME: "odf.ObjectType",
                        type: "list",
                        otherAttributes: {
                            type: "list"
                        },
                        id: [
                            {
                                TYPE_NAME: "odf.QlmID",
                                value: "ParkingSpaces"
                            }
                        ],
                        object: this.parkingSpaces.map(space => space.getUpdateAvailableOdf())
                    }
                ]

            }
        }
    };

    getOdf() {
        let template = {
            name: {
                namespaceURI: "",
                localPart: "Object",
                prefix: "",
                key: "Object",
                string: "Object"
            },
            value: {
                TYPE_NAME: "odf.ObjectType",
                type: "mv:ParkingFacility",
                otherAttributes: {
                    type: "mv:ParkingFacility"
                },
                id: [
                    {
                        TYPE_NAME: "odf.QlmID",
                        value: this.id
                    }
                ],
                infoItem: [
                    {
                        TYPE_NAME: "odf.InfoItemType",
                        nameAttribute: "ownedBy",
                        otherAttributes: {
                            type: "mv:ownedBy",
                            name: "ownedBy"
                        },
                        value: [
                            {
                                TYPE_NAME: "odf.ValueType",
                                value: this.owneBy
                            }
                        ]
                    }
                    ,
                    {
                        TYPE_NAME: "odf.InfoItemType",
                        nameAttribute: "name",
                        otherAttributes: {
                            type: "mv:name",
                            name: "name"
                        },
                        value: [
                            {
                                TYPE_NAME: "odf.ValueType",
                                value: this.name
                            }
                        ]
                    }
                ],
                object: [
                    {
                        TYPE_NAME: "odf.ObjectType",
                        type: "list",
                        otherAttributes: {
                            type: "list"
                        },
                        id: [
                            {
                                TYPE_NAME: "odf.QlmID",
                                value: "ParkingSpaces"
                            }
                        ],
                        object: this.parkingSpaces.map(space => space.getOdf())
                    },
                    this.geo.getOdf(),
                    {
                        "TYPE_NAME": "odf.ObjectType",
                        "type": "list",
                        "otherAttributes": {
                            "type": "list"
                        },
                        "id": [
                            {
                                "TYPE_NAME": "odf.QlmID",
                                "value": "openingHoursSpecifications"
                            }
                        ],
                        "object": [
                            // XXX add openings
                        ]
                    },
                    {
                        "TYPE_NAME": "odf.ObjectType",
                        "type": "list",
                        "otherAttributes": {
                            "type": "list"
                        },
                        "id": [
                            {
                                "TYPE_NAME": "odf.QlmID",
                                "value": "Capacities"
                            }
                        ],
                        "object": this.capacities.map(capacity => capacity.getOdf())
                    }
                ]

            }

        };
        return template;

    }

}


