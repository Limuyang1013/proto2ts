import * as ProtoBuf from 'protobufjs';
declare function isMessage(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Type;
declare function isEnum(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Enum;
declare function isService(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Service;
declare function isNameSpace(n: ProtoBuf.ReflectionObject): n is ProtoBuf.Namespace;
declare function scalarType(type: string): string;
declare function getMapType(p: Partial<ProtoBuf.IMapField>): string;
declare function isPrimitiveType(type: string): boolean;
export { isMessage, isNameSpace, isEnum, isService, scalarType, getMapType, isPrimitiveType };
