## Introduction 📚
Proto2TS is a lightweight, out-of-the-box tool that enables seamless conversion of Proto files to TypeScript. It caters to basic daily usage scenarios and offers convenience for expansion.

## Key Features ⭐️

- Ready for Immediate Use: Proto2TS is built to be readily usable, requiring minimal setup and configuration.based on `protobufjs`
- Support for Common Use Cases: Proto2TS support the vast majority of conversion scenarios, whether it is fields, arrays, enumerations, methods or nested messages
- Easily Extensible: Proto2TS provides a flexible foundation for future expansion, allowing users to incorporate additional functionality and customize the conversion process according to their specific requirements.

## Installation and Usage 🚀

1. Install Proto2TS using the package manager of your choice:
```markdown
pnpm install proto2ts
```
2. Import `parseProtoRoot` method

```javascript
import { parseProtoRoot } from 'proto2ts'

const ts = parseProtoRoot(readFileSync(join(process.cwd(), './__proto__/bff.proto'), 'utf-8'))
```
related typescript declaration

```typescript
export interface IParseOptions {

    /** Keeps field casing instead of converting to camel case */
    keepCase?: boolean;

    /** Recognize double-slash comments in addition to doc-block comments. */
    alternateCommentMode?: boolean;

    /** Use trailing comment when both leading comment and trailing comment exist. */
    preferTrailingComment?: boolean;
}

export declare function parseProtoRoot(proto: string, options?: IParseOptions): string;
```
This way you will get a converted typescript string u can choose to write into a `.d.ts` file like me:

```typescript
writeFileSync(join(process.cwd(), './__proto__/', `./result.type.d.ts`), ts)
```

For example if proto file is like this
```protobuf
syntax = "proto2";
package proto.bff.test;

enum ErrorCode {
  ERROR_1 = 1001;
  ERROR_2 = 1002;
}

message ResponseMeta {
  optional int32 code = 1;
  required string type = 2;
}

message RequestMeta{
  message InnerItem {
    optional string comment = 1;
    repeated string photos = 2;
    repeated string videos = 3;
  }

  optional string comment = 1;
  repeated ResponseMeta photos = 2;
  repeated string videos = 3;
  map<string, ResponseMeta> map_meta = 4;
  map<string, string> map_string = 5;
  optional InnerItem item = 6;
}

service GRPCDemo {
  rpc SimpleMethod (RequestMeta) returns (ResponseMeta);
}
```
After conversion it will look like this

```typescript
declare namespace proto.bff.test {

  declare namespace RequestMeta {
    export interface InnerItem {
        comment?: string;
        photos: string[];
        videos: string[];
    }

  }

  export enum ErrorCode {
    ERROR_1 = 1001,
    ERROR_2 = 1002,
  }

  export interface ResponseMeta {
    code?: number;
    type: string;
  }

  export interface RequestMeta {
    comment?: string;
    photos: proto.bff.test.ResponseMeta[];
    videos: string[];
    map_meta: Record<string, proto.bff.test.ResponseMeta>;
    map_string: Record<string, string>;
    item?: RequestMeta.InnerItem;
  }

  export interface SimpleMethod {
    (params: RequestMeta): Promise<ResponseMeta>;
  }

}

```

## Related Projects and References 🌐

- [prtobufjs](https://protobufjs.github.io/protobuf.js/index.html) Official Protocol Buffers documentation
