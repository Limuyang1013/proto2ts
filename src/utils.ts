import * as ProtoBuf from 'protobufjs';

function isMessage(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Type {
    return n instanceof ProtoBuf.Type;
}

function isEnum(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Enum {
    return n instanceof ProtoBuf.Enum;
}

function isService(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Service {
    return n instanceof ProtoBuf.Service;
}

function isNameSpace(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Namespace {
    return n instanceof ProtoBuf.Namespace;
}

function scalarType(type: string) {
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

function getMapType(p: Partial<ProtoBuf.IMapField>) {
    if (p.keyType && p.type) {
        return `${scalarType(p.type)}`;
    }

    return '';
}

function isPrimitiveType(type: string) {
    return type === 'string' || type === 'number' || type === 'boolean';
}

export {
    isMessage,
    isNameSpace,
    isEnum,
    isService,
    scalarType,
    getMapType,
    isPrimitiveType
}
