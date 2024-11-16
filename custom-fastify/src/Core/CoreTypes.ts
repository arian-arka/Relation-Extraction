import {FastifyReply, FastifyRequest} from "fastify";
import Middleware from "./Class/Middleware";
import {JSONSchemaType, Options} from "ajv";
import {ValidationError} from "./Class/Request"

export type AsyncRequestHandlerType = (request: FastifyRequest, reply: FastifyReply) => Promise<any>;

export type SyncRequestHandlerType = (request: FastifyRequest, reply: FastifyReply, done: Function) => any;

export type RequestHandlerType = AsyncRequestHandlerType | SyncRequestHandlerType;

export type MiddlewareType = RequestHandlerType | Middleware | any;

export type ActionType = RequestHandlerType | string;

export type RouteObjectType = {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    handler: RequestHandlerType,
    middlewares?: RequestHandlerType[],
}

export type FastifyRouteObjectType = {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    handler: RequestHandlerType,
    preHandler: RequestHandlerType[],
    schema : any,
}

export type BadRequestMessageType = {
    [key: string]: string
};

export type RequestSchemaType< Body = any, Query = any, Params = any, Headers = any> = {
    body?: JSONSchemaType<Body>,
    query?: JSONSchemaType<Query>,
    params?: JSONSchemaType<Params>,
    headers?: JSONSchemaType<Headers>,
    custom?: (request: FastifyRequest<{
        Querystring: Query,
        Headers: Headers,
        Body: Body,
        Params: Params,
    }>, v: ValidationError) => void
};

export type RequestSchemaOptionType = {
    body?: Options,
    query?: Options,
    params?: Options,
    headers?: Options,
};

export type ValidateOptionType = {
    breakOnFirstOrder?: boolean,
    throw?: boolean,
    order: ['body' | 'query' | 'params' | 'headers' | 'custom', 'body' | 'query' | 'params' | 'headers' | 'custom', 'body' | 'query' | 'params' | 'headers' | 'custom', 'body' | 'query' | 'params' | 'headers' | 'custom', 'body' | 'query' | 'params' | 'headers' | 'custom']
}

export type ReqType<Body= any, Query = any, Params = any, Headers = any> = FastifyRequest<{
    Querystring: Query,
    Headers: Headers,
    Body: Body,
    Params: Params,
}>;

export type BodyReqType<Body = any> = ReqType<Body>;

export type BodyParamsReqType<Body = any,Params = any> = ReqType<Body,any,Params>;

export type QueryReqType<Query = any> = ReqType<any,Query>;

export type QueryParamsReqType<Query = any,Params = any> = ReqType<any,Query,Params>;

export type ParamsReqType<Params = any> = ReqType<any,any,Params>;

export type Headers<Headers = any> = ReqType<any,any,any,Headers>;