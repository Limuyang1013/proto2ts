import * as ProtoBuf from 'protobufjs';
declare function printMessage(ast: ProtoBuf.Type, namespace: string, level: number): string;
declare function printEnum(ast: ProtoBuf.Enum, level: number): string;
declare function printMethods(ast: ProtoBuf.Service, level: number): string;
declare function printSpace(num: number, padding?: number): string;
export { printMessage, printEnum, printMethods, printSpace };
