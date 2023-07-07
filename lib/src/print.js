"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printSpace = exports.printMethods = exports.printEnum = exports.printMessage = void 0;
const utils_1 = require("./utils");
const EMPTY = 'google.protobuf.Empty';
var CATEGORY;
(function (CATEGORY) {
    CATEGORY["MESSAGE"] = "message";
    CATEGORY["ENUM"] = "enum";
    CATEGORY["METHOD"] = "method";
})(CATEGORY || (CATEGORY = {}));
var RULE;
(function (RULE) {
    RULE["REPEATED"] = "repeated";
    RULE["REQUIRED"] = "required";
    RULE["OPTIONAL"] = "optional";
})(RULE || (RULE = {}));
function printMessage(ast, namespace, level) {
    function readField(fields) {
        const params = Object.keys(fields).map((propertyName) => {
            const field = fields[propertyName];
            return {
                id: field.id,
                name: propertyName,
                type: (0, utils_1.scalarType)(field.type),
                mapType: (0, utils_1.getMapType)(field),
                rule: field === null || field === void 0 ? void 0 : field.rule
            };
        });
        return {
            category: CATEGORY.MESSAGE,
            name: ast.name,
            params: params.sort((a, b) => a.id - b.id),
        };
    }
    function appendTypePrefix(type, namespace) {
        return (0, utils_1.isPrimitiveType)(type) ? type : `${namespace}.${type}`;
    }
    const fields = ast.fields;
    const fieldsStructure = readField(fields);
    const nestedArrayMessageName = ast.nestedArray.map((r) => r.name);
    const strs = fieldsStructure.params.map((param) => {
        // Handle array types
        if (param.rule === RULE.REPEATED) {
            return `${printSpace(level, 4)}${param.name}: ${nestedArrayMessageName.includes(param.type) ? `${ast.name}.${param.type}` : appendTypePrefix(param.type, namespace)}[];\n`;
        }
        // Handle map type
        if (param.mapType) {
            return `${printSpace(level, 4)}${param.name}: Record<string, ${nestedArrayMessageName.includes(param.mapType) ? `${ast.name}.${param.mapType}` : appendTypePrefix(param.mapType, namespace)}>;\n`;
        }
        return `${printSpace(level, 4)}${param.name}${param.rule === RULE.REQUIRED ? '' : '?'}: ${nestedArrayMessageName.includes(param.type) ? `${ast.name}.${param.type}` : appendTypePrefix(param.type, namespace)};\n`;
    });
    return (strs.length ?
        `${printSpace(level)}export interface ${fieldsStructure.name} {${strs.length ? `\n${strs.join('')}` : ''}${printSpace(level)}}\n\n` : '');
}
exports.printMessage = printMessage;
function printEnum(ast, level) {
    function readField(enums) {
        const params = Object.keys(enums)
            .map((key) => ({
            name: key,
            id: enums[key],
        }));
        return {
            category: CATEGORY.ENUM,
            name: ast.name,
            params: params.sort((a, b) => a.id - b.id),
        };
    }
    const enums = ast.values;
    const fieldsStructure = readField(enums);
    const strs = fieldsStructure.params.map((s) => `    ${s.name} = ${s.id},\n`).join('');
    return `${printSpace(level)}export enum ${fieldsStructure.name} {\n${strs}${printSpace(level)}}\n\n`;
}
exports.printEnum = printEnum;
function printMethods(ast, level) {
    function readMethod(methods) {
        const params = Object.keys(methods).map((methodName) => {
            const { name, ...others } = methods[methodName];
            return { name: methodName, ...others };
        });
        return {
            category: CATEGORY.METHOD,
            params,
        };
    }
    const methods = ast.methods;
    const fieldsStructure = readMethod(methods);
    const strs = fieldsStructure.params.map((param) => {
        const requestType = param.requestType === EMPTY ? '' : `params: ${param.requestType}`;
        const responseType = param.responseType === EMPTY ? '{}' : param.responseType;
        return (`${printSpace(level)}export interface ${param.name} {\n` +
            `${printSpace(level, 4)}(${requestType}): Promise<${responseType}>;\n` +
            `${printSpace(level)}}\n` +
            `\n`);
    });
    return `${strs.join('')}`;
}
exports.printMethods = printMethods;
function printSpace(num, padding = 2) {
    let str = '';
    for (let i = 0; i < num * padding; i++) {
        str += ' ';
    }
    return str;
}
exports.printSpace = printSpace;
