export class GeoCoordinates {

    constructor(longitude, latitude, postalAddress, id = 'geo') {
        this._latitude = latitude;
        this._longitude = longitude;
        this._postalAddress = postalAddress;
        this._id = id;
    }

    getOdf() {
        return {
            "TYPE_NAME": "odf.ObjectType",
            "type": "schema:GeoCoordinates",
            "otherAttributes": {
                "type": "schema:GeoCoordinates"
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
                    "nameAttribute": "latitude",
                    "otherAttributes": {
                        "name": "latitude"
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
                            "value": this._latitude + ""
                        }
                    ]
                },
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "longitude",
                    "otherAttributes": {
                        "name": "longitude"
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
                            "value": this._longitude + ""
                        }
                    ]
                }
            ]
            // XXX postalAddress
/*            ,
            "object": [
                {
                    "TYPE_NAME": "odf.ObjectType",
                    "type": "schema:PostalAddress",
                    "otherAttributes": {
                        "type": "schema:PostalAddress"
                    },
                    "id": [
                        {
                            "TYPE_NAME": "odf.QlmID",
                            "value": "address"
                        }
                    ],
                    "infoItem": [
                        {
                            "TYPE_NAME": "odf.InfoItemType",
                            "nameAttribute": "addressLocality",
                            "otherAttributes": {
                                "name": "addressLocality"
                            },
                            "value": [
                                {
                                    "TYPE_NAME": "odf.ValueType",
                                    "unixTime": 1540722701,
                                    "dateTime": {
                                        "year": 2018,
                                        "month": 10,
                                        "day": 28,
                                        "hour": 12,
                                        "minute": 31,
                                        "second": 41,
                                        "fractionalSecond": 0.972,
                                        "timezone": 120,
                                        "date": "2018-10-28T10:31:41.972Z"
                                    },
                                    "otherAttributes": {
                                        "unixTime": "1540722701",
                                        "dateTime": "2018-10-28T12:31:41.972+02:00"
                                    },
                                    "value": "Otaniemi"
                                }
                            ]
                        },
                        {
                            "TYPE_NAME": "odf.InfoItemType",
                            "nameAttribute": "postalCode",
                            "otherAttributes": {
                                "name": "postalCode"
                            },
                            "value": [
                                {
                                    "TYPE_NAME": "odf.ValueType",
                                    "unixTime": 1540722701,
                                    "type": "xs:double",
                                    "dateTime": {
                                        "year": 2018,
                                        "month": 10,
                                        "day": 28,
                                        "hour": 12,
                                        "minute": 31,
                                        "second": 41,
                                        "fractionalSecond": 0.972,
                                        "timezone": 120,
                                        "date": "2018-10-28T10:31:41.972Z"
                                    },
                                    "otherAttributes": {
                                        "unixTime": "1540722701",
                                        "type": "xs:double",
                                        "dateTime": "2018-10-28T12:31:41.972+02:00"
                                    },
                                    "value": "\n                2150.0\n            "
                                }
                            ]
                        },
                        {
                            "TYPE_NAME": "odf.InfoItemType",
                            "nameAttribute": "addressCountry",
                            "otherAttributes": {
                                "name": "addressCountry"
                            },
                            "value": [
                                {
                                    "TYPE_NAME": "odf.ValueType",
                                    "unixTime": 1540722701,
                                    "dateTime": {
                                        "year": 2018,
                                        "month": 10,
                                        "day": 28,
                                        "hour": 12,
                                        "minute": 31,
                                        "second": 41,
                                        "fractionalSecond": 0.972,
                                        "timezone": 120,
                                        "date": "2018-10-28T10:31:41.972Z"
                                    },
                                    "otherAttributes": {
                                        "unixTime": "1540722701",
                                        "dateTime": "2018-10-28T12:31:41.972+02:00"
                                    },
                                    "value": "Finland"
                                }
                            ]
                        },
                        {
                            "TYPE_NAME": "odf.InfoItemType",
                            "nameAttribute": "streetAddress",
                            "otherAttributes": {
                                "name": "streetAddress"
                            },
                            "value": [
                                {
                                    "TYPE_NAME": "odf.ValueType",
                                    "unixTime": 1540722701,
                                    "dateTime": {
                                        "year": 2018,
                                        "month": 10,
                                        "day": 28,
                                        "hour": 12,
                                        "minute": 31,
                                        "second": 41,
                                        "fractionalSecond": 0.972,
                                        "timezone": 120,
                                        "date": "2018-10-28T10:31:41.972Z"
                                    },
                                    "otherAttributes": {
                                        "unixTime": "1540722701",
                                        "dateTime": "2018-10-28T12:31:41.972+02:00"
                                    },
                                    "value": "Otaniementie 9"
                                }
                            ]
                        },
                        {
                            "TYPE_NAME": "odf.InfoItemType",
                            "nameAttribute": "addressRegion",
                            "otherAttributes": {
                                "name": "addressRegion"
                            },
                            "value": [
                                {
                                    "TYPE_NAME": "odf.ValueType",
                                    "unixTime": 1540722701,
                                    "dateTime": {
                                        "year": 2018,
                                        "month": 10,
                                        "day": 28,
                                        "hour": 12,
                                        "minute": 31,
                                        "second": 41,
                                        "fractionalSecond": 0.972,
                                        "timezone": 120,
                                        "date": "2018-10-28T10:31:41.972Z"
                                    },
                                    "otherAttributes": {
                                        "unixTime": "1540722701",
                                        "dateTime": "2018-10-28T12:31:41.972+02:00"
                                    },
                                    "value": "Espoo"
                                }
                            ]
                        }
                    ]
                }
            ]
*/
        }
    }
}