"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProtoRoot = void 0;
const ProtoBuf = require("protobufjs");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const print_1 = require("./print");
function parseProtoRoot(proto, options) {
    try {
        const ast = ProtoBuf.parse(proto, {
            keepCase: true,
            alternateCommentMode: false,
            ...options
        });
        return crawlAST(ast.root, ast.package || ast.root.name, true, 1);
    }
    catch (e) {
        throw e;
    }
}
exports.parseProtoRoot = parseProtoRoot;
function crawlAST(ast, namespace, root = true, level) {
    const result = [];
    let nestedstrs = '';
    let nestedArray = [...ast.lookup(namespace).nestedArray];
    nestedArray.forEach((nestedObject) => {
        if ((0, utils_1.isMessage)(nestedObject)) {
            if (nestedObject.nestedArray.length) {
                nestedObject.nestedArray.forEach(i => {
                    const nextLevel = level + 1;
                    nestedstrs += crawlAST(i, nestedObject.name, false, nextLevel);
                });
                nestedstrs = `\n${(0, print_1.printSpace)(level)}declare namespace ${nestedObject.name} {\n` +
                    `${nestedstrs}` +
                    `${(0, print_1.printSpace)(level)}}\n`;
            }
            result.push((0, print_1.printMessage)(nestedObject, namespace, level));
        }
        if ((0, utils_1.isEnum)(nestedObject)) {
            result.push((0, print_1.printEnum)(nestedObject, level));
        }
        if ((0, utils_1.isService)(nestedObject)) {
            result.push((0, print_1.printMethods)(nestedObject, level));
        }
    });
    if (root) {
        return `declare namespace ${namespace} {\n` +
            `${nestedstrs.length ? `${nestedstrs}\n` : ''}` +
            `${result.join('')}` +
            `}\n`;
    }
    else {
        return result.join('');
    }
}
const r = parseProtoRoot((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), './__proto__/bff.proto'), 'utf-8'));
(0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), './__proto__/', `./result.type.d.ts`), r);
