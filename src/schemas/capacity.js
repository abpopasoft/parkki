export class Capacity {

    constructor(id, validFor, maxCapacity, realTimeCapacity = 0) {
        this._id = id + "";
        this._validFor = validFor + "";
        this._maxCapacity = maxCapacity + "";
        this._realTimeCapacity = realTimeCapacity + "";
    }


    getOdf() {
        return {
            "TYPE_NAME": "odf.ObjectType",
            "type": "mv:Capacity",
            "otherAttributes": {
                "type": "mv:Capacity"
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
                    "nameAttribute": "maximumValue",
                    "otherAttributes": {
                        "type": "mv:maximumValue",
                        "name": "maximumValue"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            "value": this._maxCapacity
                        }
                    ]
                },
                {
                    "TYPE_NAME": "odf.InfoItemType",
                    "nameAttribute": "realTimeValue",
                    "otherAttributes": {
                        "type": "mv:realTimeValue",
                        "name": "realTimeValue"
                    },
                    "value": [
                        {
                            "TYPE_NAME": "odf.ValueType",
                            "value": this._realTimeCapacity
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
                            "value": this._validFor
                        }
                    ]
                }
            ]
        }
    }
}