export class ParkingSpace {

    constructor(id, available, heightLimit, widthLimit, validFor, lengthLimit) {
        this._id = id;
        this._available = available;
        this._heightLimit = heightLimit;
        this._widthLimit = widthLimit;
        this._validFor = validFor;
        this._lengthLimit = lengthLimit;

    }

    getUpdateAvailableOdf() {
        return {
                "TYPE_NAME": "odf.ObjectType",
                "type": "mv:ParkingSpace",
                "otherAttributes": {
                    "type": "mv:ParkingSpace"
                },
                "id": [
                    {
                        "TYPE_NAME": "odf.QlmID",
                        "value": this._id
                    }
                ],
                "infoItem": [
                    {
                        "TYPE_NAME": "odf.InfoItemType",
                        "nameAttribute": "available",
                        "otherAttributes": {
                            "name": "available"
                        },
                        "value": [
                            {
                                "TYPE_NAME": "odf.ValueType",
                                "type": "xs:boolean",
                                "value": this._available.toString()
                            }
                        ]
                    }
                ]
            }

    }

    getOdf() {
        return {
            "TYPE_NAME": "odf.ObjectType",
            "type": "mv:ParkingSpace",
            "otherAttributes": {
                "type": "mv:ParkingSpace"
            },
            "id": [
                {
                    "TYPE_NAME": "odf.QlmID",
                    "value": this._id
                }
            ],
            "infoItem": [
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "available",
                    "otherAttributes": {
                        "name": "available"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            // "unixTime": 1540722701,
                            "type": "xs:boolean",
                            // "dateTime": {
                            //     "year": 2018,
                            //     "month": 10,
                            //     "day": 28,
                            //     "hour": 12,
                            //     "minute": 31,
                            //     "second": 41,
                            //     "fractionalSecond": 0.972,
                            //     "timezone": 120,
                            //     "date": "2018-10-28T10:31:41.972Z"
                            // },
                            // "otherAttributes": {
                            //     "unixTime": "1540722701",
                            //     "type": "xs:boolean",
                            //     "dateTime": "2018-10-28T12:31:41.972+02:00"
                            // },
                            "value": this._available.toString()
                        }
                    ]
                },
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "vehicleHeightLimit",
                    "otherAttributes": {
                        "type": "mv:vehicleHeightLimit",
                        "name": "vehicleHeightLimit"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            // "unixTime": 1540722701,
                            "type": "xs:double",
                            // "dateTime": {
                            //     "year": 2018,
                            //     "month": 10,
                            //     "day": 28,
                            //     "hour": 12,
                            //     "minute": 31,
                            //     "second": 41,
                            //     "fractionalSecond": 0.972,
                            //     "timezone": 120,
                            //     "date": "2018-10-28T10:31:41.972Z"
                            // },
                            // "otherAttributes": {
                            //     "unixTime": "1540722701",
                            //     "type": "xs:double",
                            //     "dateTime": "2018-10-28T12:31:41.972+02:00"
                            // },
                            "value": this._heightLimit.toString()
                        }
                    ]
                },
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "vehicleWidthLimit",
                    "otherAttributes": {
                        "type": "mv:vehicleWidthLimit",
                        "name": "vehicleWidthLimit"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            // "unixTime": 1540722701,
                            "type": "xs:double",
                            // "dateTime": {
                            //     "year": 2018,
                            //     "month": 10,
                            //     "day": 28,
                            //     "hour": 12,
                            //     "minute": 31,
                            //     "second": 41,
                            //     "fractionalSecond": 0.972,
                            //     "timezone": 120,
                            //     "date": "2018-10-28T10:31:41.972Z"
                            // },
                            // "otherAttributes": {
                            //     "unixTime": "1540722701",
                            //     "type": "xs:double",
                            //     "dateTime": "2018-10-28T12:31:41.972+02:00"
                            // },
                            "value": this._widthLimit.toString()
                        }
                    ]
                },
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "validForVehicle",
                    "otherAttributes": {
                        "type": "mv:validForVehicle",
                        "name": "validForVehicle"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            // "unixTime": 1540722701,
                            // "dateTime": {
                            //     "year": 2018,
                            //     "month": 10,
                            //     "day": 28,
                            //     "hour": 12,
                            //     "minute": 31,
                            //     "second": 41,
                            //     "fractionalSecond": 0.972,
                            //     "timezone": 120,
                            //     "date": "2018-10-28T10:31:41.972Z"
                            // },
                            // "otherAttributes": {
                            //     "unixTime": "1540722701",
                            //     "dateTime": "2018-10-28T12:31:41.972+02:00"
                            // },
                            "value": this._validFor
                        }
                    ]
                },
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "vehicleLengthLimit",
                    "otherAttributes": {
                        "type": "mv:vehicleLengthLimit",
                        "name": "vehicleLengthLimit"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            // "unixTime": 1540722701,
                            "type": "xs:double",
                            // "dateTime": {
                            //     "year": 2018,
                            //     "month": 10,
                            //     "day": 28,
                            //     "hour": 12,
                            //     "minute": 31,
                            //     "second": 41,
                            //     "fractionalSecond": 0.972,
                            //     "timezone": 120,
                            //     "date": "2018-10-28T10:31:41.972Z"
                            // },
                            // "otherAttributes": {
                            //     "unixTime": "1540722701",
                            //     "type": "xs:double",
                            //     "dateTime": "2018-10-28T12:31:41.972+02:00"
                            // },
                            "value": this._lengthLimit.toString()
                        }
                    ]
                }
            ]
        }
    }


}