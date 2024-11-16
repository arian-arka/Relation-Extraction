import {BodyParamsReqType, BodyReqType, ParamsReqType, ReqType, RequestHandlerType} from "../CoreTypes";
import {FastifyReply, FastifyRequest} from "fastify";
import Path from "../Singleton/Path";

export abstract class Can<Body = any, Query = any, Params = any, Headers = any> {
    public static find(path: string): (request: FastifyRequest, reply: FastifyReply,...args:any[]) => Promise<any> {
        const splited = path.split('@');
        return require(Path.app(splited[0]) + '.can')[splited[1]].make();
    }

    public static make(): RequestHandlerType {
        return (new (this as any)).handle;
    }

    public abstract handle(request: ReqType<Body, Query, Params, Headers>, reply: FastifyReply,...args:any[]): Promise<any>;
}

export abstract class CanBody<Body = any> extends Can<Body> {
    public abstract handle(request: BodyReqType<Body>, reply: FastifyReply,...args:any[]): Promise<any>;
}

export abstract class CanParams<Params = any> extends Can<any, Params> {
    public abstract handle(request: ParamsReqType<Params>, reply: FastifyReply,...args:any[]): Promise<any>;
}

export abstract class CanBodyParams<Body = any, Params = any> extends Can<Body, any, Params> {
    public abstract handle(request: BodyParamsReqType<Body, Params>, reply: FastifyReply,...args:any[]): Promise<any>;
}