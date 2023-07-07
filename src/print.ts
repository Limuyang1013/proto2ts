import * as ProtoBuf from 'protobufjs';
import { getMapType, isPrimitiveType, scalarType } from "./utils";

const EMPTY = 'google.protobuf.Empty';

enum CATEGORY {
    MESSAGE = 'message',
    ENUM = 'enum',
    METHOD = 'method'
}

enum RULE {
    REPEATED = 'repeated',
    REQUIRED = 'required',
    OPTIONAL = 'optional'
}

interface IPrintStructure {
    category: CATEGORY,
    name: string,
    params: {
        id?: number,
        name: string,
        type?: string,
        mapType?: string,
        rule?: RULE,
    }[],
}

function printMessage(ast: ProtoBuf.Type, namespace: string, level: number) {

    function readField(fields: { [key: string]: ProtoBuf.IField }): IPrintStructure {
        const params =  Object.keys(fields).map((propertyName: string) => {
            const field: ProtoBuf.IField = fields[propertyName]

            return {
                id: field.id,
                name: propertyName,
                type: scalarType(field.type),
                mapType: getMapType(field),
                rule: field?.rule as RULE
            }
        })

        return {
            category: CATEGORY.MESSAGE,
            name: ast.name,
            params: params.sort((a, b) => a.id - b.id),
        }
    }

    function appendTypePrefix(type: string, namespace: string) {
        return isPrimitiveType(type) ? type  : `${namespace}.${type}`
    }

    const fields = ast.fields

    const fieldsStructure  = readField(fields)

    const nestedArrayMessageName = ast.nestedArray.map((r) => r.name);

    const strs = fieldsStructure.params.map((param) => {
        // Handle array types
        if (param.rule === RULE.REPEATED) {
            return `${printSpace(level, 4)}${param.name}: ${nestedArrayMessageName.includes(param.type!) ? `${ast.name}.${param.type!}` : appendTypePrefix(param.type!, namespace)}[];\n`;
        }

        // Handle map type
        if (param.mapType) {
            return`${printSpace(level, 4)}${param.name}: Record<string, ${nestedArrayMessageName.includes(param.mapType!) ? `${ast.name}.${param.mapType!}` : appendTypePrefix(param.mapType, namespace)}>;\n`;
        }
        return `${printSpace(level, 4)}${param.name}${param.rule === RULE.REQUIRED ? '' : '?'}: ${nestedArrayMessageName.includes(param.type!) ? `${ast.name}.${param.type!}` : appendTypePrefix(param.type!, namespace)};\n`;
    })

    return (
        strs.length ?
        `${printSpace(level)}export interface ${fieldsStructure.name} {${strs.length ? `\n${strs.join('')}` : ''}${printSpace(level)}}\n\n` : ''
    );
}

function printEnum(ast: ProtoBuf.Enum, level: number) {

    function readField(enums: { [key: string]: number }): IPrintStructure {
        const params = Object.keys(enums)
            .map((key) => ({
                name: key,
                id: enums[key],
            }))

        return {
            category: CATEGORY.ENUM,
            name: ast.name,
            params: params.sort((a, b) => a.id - b.id),
        }
    }
    const enums = ast.values

    const fieldsStructure  = readField(enums)

    const strs = fieldsStructure.params.map((s) => `    ${s.name} = ${s.id},\n`).join('');

    return `${printSpace(level)}export enum ${fieldsStructure.name} {\n${strs}${printSpace(level)}}\n\n`;
}

function printMethods(ast: ProtoBuf.Service, level: number) {

    function readMethod(methods: { [key: string]: ProtoBuf.Method }) {
        const params = Object.keys(methods).map((methodName) => {
            const { name, ...others} = methods[methodName];

            return { name: methodName, ...others };
        });

        return {
            category: CATEGORY.METHOD,
            params,
        };
    }
    const methods = ast.methods;
    const fieldsStructure = readMethod(methods)

    const strs = fieldsStructure.params.map((param) => {
        const requestType =
            param.requestType === EMPTY ? '' : `params: ${param.requestType}`;
        const responseType =
            param.responseType === EMPTY ? '{}' : param.responseType;

        return (
            `${printSpace(level)}export interface ${param.name} {\n` +
            `${printSpace(level, 4)}(${requestType}): Promise<${responseType}>;\n` +
            `${printSpace(level)}}\n` +
            `\n`
        );
    });

    return `${strs.join('')}`;
}

function printSpace(num: number, padding:number = 2) {
    let str = '';
    for (let i = 0; i < num * padding; i++) {
        str += ' ';
    }
    return str;
}


export {
    printMessage,
    printEnum,
    printMethods,
    printSpace
}
