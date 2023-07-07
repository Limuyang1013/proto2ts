"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitiveType = exports.getMapType = exports.scalarType = exports.isService = exports.isEnum = exports.isNameSpace = exports.isMessage = void 0;
const ProtoBuf = require("protobufjs");
function isMessage(n) {
    return n instanceof ProtoBuf.Type;
}
exports.isMessage = isMessage;
function isEnum(n) {
    return n instanceof ProtoBuf.Enum;
}
exports.isEnum = isEnum;
function isService(n) {
    return n instanceof ProtoBuf.Service;
}
exports.isService = isService;
function isNameSpace(n) {
    return n instanceof ProtoBuf.Namespace;
}
exports.isNameSpace = isNameSpace;
function scalarType(type) {
    switch (type) {
        case 'float':
        case 'double':
        case 'sfixed32':
        case 'fixed32':
        case 'varint':
        case 'enum':
        case 'uint64':
        case 'uint32':
        case 'int64':
        case 'int32':
        case 'sint64':
        case 'sint32':
            return 'number';
        case 'string':
            return 'string';
        case 'bool':
            return 'boolean';
        case 'bytes':
            return 'string';
    }
    return type;
}
exports.scalarType = scalarType;
function getMapType(p) {
    if (p.keyType && p.type) {
        return `${scalarType(p.type)}`;
    }
    return '';
}
exports.getMapType = getMapType;
function isPrimitiveType(type) {
    return type === 'string' || type === 'number' || type === 'boolean';
}
exports.isPrimitiveType = isPrimitiveType;
