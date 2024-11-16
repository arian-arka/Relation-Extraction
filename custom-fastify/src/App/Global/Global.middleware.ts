import {FastifyReply, FastifyRequest} from "fastify";
import Middleware from "../../Core/Class/Middleware";
import CsrfConfig from "../../Config/Csrf";

export class CsrfMiddleware extends Middleware {
    // @ts-ignore
    handle(request: FastifyRequest, reply: FastifyReply,done : Function) {
        // @ts-ignore
        console.log('from csrf',CsrfConfig.methods.includes(request.method.toUpperCase()));
        // @ts-ignore
        if (CsrfConfig.methods.includes(request.method.toUpperCase()))
            request.csrfProtection(request, reply, done);
        else
            done();
    }
}

