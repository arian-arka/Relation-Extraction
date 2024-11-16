import {FastifyReply, FastifyRequest} from "fastify";
import {RequestHandlerType} from "../CoreTypes";

export default abstract class Middleware {
    public static make(): RequestHandlerType{
        return (new (this as any)).handle;
    }

    public abstract handle(request: FastifyRequest, reply: FastifyReply,done : Function): any;

    public abstract handle(request: FastifyRequest, reply: FastifyReply): Promise<any>;
}
