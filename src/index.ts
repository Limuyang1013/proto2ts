import * as ProtoBuf from 'protobufjs';
import { isEnum, isMessage, isService } from "./utils";
import { printEnum, printMessage, printMethods, printSpace } from "./print";

export function parseProtoRoot(proto: string, options?: ProtoBuf.IParseOptions) {
    try {
        const ast = ProtoBuf.parse(
            proto,
            {
                keepCase: true,
                alternateCommentMode: false,
                ...options
            },
        );

        return crawlAST(ast.root, ast.package || ast.root.name, true, 1)
    } catch (e) {
        throw e
    }
}

function crawlAST(ast: ProtoBuf.Root, namespace: string, root: boolean = true, level: number) {
    const result: string[] = []
    let nestedstrs = ''
    let nestedArray = [...(ast.lookup(namespace) as ProtoBuf.Namespace).nestedArray]

    nestedArray.forEach((nestedObject: ProtoBuf.ReflectionObject) => {
        if (isMessage(nestedObject)) {
            if (nestedObject.nestedArray.length) {
                nestedObject.nestedArray.forEach(i => {
                    const nextLevel = level + 1
                    nestedstrs += crawlAST(i as ProtoBuf.Root, nestedObject.name, false, nextLevel)
                })

                nestedstrs =`\n${printSpace(level)}declare namespace ${nestedObject.name} {\n` +
                `${nestedstrs}` +
                `${printSpace(level)}}\n`
            }
            result.push(printMessage(nestedObject, namespace, level))
        }

        if (isEnum(nestedObject)) {
            result.push(printEnum(nestedObject, level))
        }

        if (isService(nestedObject)) {
            result.push(printMethods(nestedObject, level))
        }
    })


    if (root) {
        return `declare namespace ${namespace} {\n` +
            `${nestedstrs.length ? `${nestedstrs}\n` : ''}` +
            `${result.join('')}` +
            `}\n`
    } else {
        return result.join('')
    }
}
