import {Request} from "./Class/Request";
import "reflect-metadata";
import Controller from "./Class/Controller";
import {FastifyReply} from "fastify";
import {ReqType} from "./CoreTypes";


export function validate<Body = any, Query = any, Params = any, Headers = any>(req: Request<Body, Query, Params, Headers>) {
    return function (target: Controller, propertyKey: string,
                     descriptor:
                         TypedPropertyDescriptor<(request: ReqType<Body, Query, Params, Headers>, reply?: FastifyReply) => Promise<any>> |
                         TypedPropertyDescriptor<(request: ReqType<Body, Query, Params, Headers>, reply: FastifyReply) => Promise<any>> |
                         TypedPropertyDescriptor<(request: ReqType<Body, Query, Params, Headers>, reply: FastifyReply) => any> |
                         TypedPropertyDescriptor<(request: ReqType<Body, Query, Params, Headers>, reply?: FastifyReply) => any>
    )  {
        const method = descriptor.value;
        if(!method)
            return;

        if (method?.constructor.name === 'AsyncFunction') {
            descriptor.value = async function (request: ReqType<Body, Query, Params, Headers>, reply: FastifyReply) {
                await req.validate(request);
                return await method.apply(this, [request, reply]);
            }
        } else if (method) {
            descriptor.value = function (request: ReqType<Body, Query, Params, Headers>, reply: FastifyReply) {
                req.validate(request).then((r) => {
                    method.apply(this, [request, reply])
                })
            }
        }
    }
}

export function vBody<Body = any>(req: Request<Body>) {
    return validate<Body>(req);
}

export function vBodyParams<Body = any,Params = any>(req: Request<Body,Params>) {
    return validate<Body,Params>(req);
}

export function vQuery<vQuery = any>(req: Request<any,vQuery>) {
    return validate<any,vQuery>(req);
}

export function vQueryParams<Query = any,Params = any>(req: Request<any,Query,Params>) {
    return validate<any,Query,Params>(req);
}

export function vParams<Params = any>(req: Request<any,any,Params>) {
    return validate<any,any,Params>(req);
}

export function vHeaders<Headers = any>(req: Request<any,any,any,Headers>) {
    return validate<any,any,any,Headers>(req);
}
