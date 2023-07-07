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
