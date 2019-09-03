
var odf_Module_Factory = function () {
    var odf = {
        name: 'odf',
        typeInfos: [{
            localName: 'InfoItemType',
            propertyInfos: [{
                name: 'otherAttributes',
                type: 'anyAttribute'
            }, {
                name: 'name',
                minOccurs: 0,
                collection: true,
                elementName: {
                    localPart: 'name'
                },
                typeInfo: '.QlmID'
            }, {
                name: 'description',
                elementName: {
                    localPart: 'description'
                },
                typeInfo: '.Description'
            }, {
                name: 'metaData',
                elementName: {
                    localPart: 'MetaData'
                },
                typeInfo: '.InfoItemType.MetaData'
            }, {
                name: 'value',
                minOccurs: 0,
                collection: true,
                elementName: {
                    localPart: 'value'
                },
                typeInfo: '.ValueType'
            }, {
                name: 'nameAttribute',
                required: true,
                typeInfo: 'AnySimpleType',
                attributeName: {
                    localPart: 'name'
                },
                type: 'attribute'
            }]
        }, {
            localName: 'Description',
            typeName: null,
            propertyInfos: [{
                name: 'otherAttributes',
                type: 'anyAttribute'
            }, {
                name: 'value',
                type: 'value'
            }, {
                name: 'lang',
                attributeName: {
                    localPart: 'lang'
                },
                type: 'attribute'
            }]
        }, {
            localName: 'ObjectType',
            propertyInfos: [{
                name: 'otherAttributes',
                type: 'anyAttribute'
            }, {
                name: 'id',
                required: true,
                collection: true,
                elementName: {
                    localPart: 'id'
                },
                typeInfo: '.QlmID'
            }, {
                name: 'description',
                elementName: {
                    localPart: 'description'
                },
                typeInfo: '.Description'
            }, {
                name: 'infoItem',
                minOccurs: 0,
                collection: true,
                elementName: {
                    localPart: 'InfoItem'
                },
                typeInfo: '.InfoItemType'
            }, {
                name: 'object',
                minOccurs: 0,
                collection: true,
                elementName: {
                    localPart: 'Object'
                },
                typeInfo: '.ObjectType'
            }, {
                name: 'type',
                typeInfo: 'AnySimpleType',
                attributeName: {
                    localPart: 'type'
                },
                type: 'attribute'
            }]
        }, {
            localName: 'ValueType',
            typeName: 'valueType',
            propertyInfos: [{
                name: 'otherAttributes',
                type: 'anyAttribute'
            }, {
                name: 'value',
                type: 'value'
            }, {
                name: 'type',
                attributeName: {
                    localPart: 'type'
                },
                type: 'attribute'
            }, {
                name: 'dateTime',
                typeInfo: 'DateTime',
                attributeName: {
                    localPart: 'dateTime'
                },
                type: 'attribute'
            }, {
                name: 'unixTime',
                typeInfo: 'Long',
                attributeName: {
                    localPart: 'unixTime'
                },
                type: 'attribute'
            }]
        }, {
            localName: 'QlmID',
            typeName: 'qlmID',
            propertyInfos: [{
                name: 'otherAttributes',
                type: 'anyAttribute'
            }, {
                name: 'value',
                type: 'value'
            }, {
                name: 'idType',
                attributeName: {
                    localPart: 'idType'
                },
                type: 'attribute'
            }, {
                name: 'tagType',
                attributeName: {
                    localPart: 'tagType'
                },
                type: 'attribute'
            }, {
                name: 'startDate',
                typeInfo: 'DateTime',
                attributeName: {
                    localPart: 'startDate'
                },
                type: 'attribute'
            }, {
                name: 'endDate',
                typeInfo: 'DateTime',
                attributeName: {
                    localPart: 'endDate'
                },
                type: 'attribute'
            }]
        }, {
            localName: 'ObjectsType',
            propertyInfos: [{
                name: 'object',
                minOccurs: 0,
                collection: true,
                elementName: {
                    localPart: 'Object'
                },
                typeInfo: '.ObjectType'
            }, {
                name: 'version',
                attributeName: {
                    localPart: 'version'
                },
                type: 'attribute'
            }]
        }, {
            localName: 'InfoItemType.MetaData',
            typeName: null,
            propertyInfos: [{
                name: 'infoItem',
                required: true,
                collection: true,
                elementName: {
                    localPart: 'InfoItem'
                },
                typeInfo: '.InfoItemType'
            }]
        }],
        elementInfos: [{
            elementName: {
                localPart: 'Object'
            },
            typeInfo: '.ObjectType'
        }, {
            elementName: {
                localPart: 'Objects'
            },
            typeInfo: '.ObjectsType'
        }, {
            elementName: {
                localPart: 'InfoItem'
            },
            typeInfo: '.InfoItemType'
        }, {
            elementName: {
                localPart: 'description'
            },
            typeInfo: '.Description'
        }, {
            elementName: {
                localPart: 'value'
            },
            typeInfo: '.ValueType'
        }]
    };
    return {
        odf: odf
    };
};
if (typeof define === 'function' && define.amd) {
    define([], odf_Module_Factory);
}
else {
    var odf_Module = odf_Module_Factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.odf = odf_Module.odf;
    }
    else {
        var odf = odf_Module.odf;
    }
}