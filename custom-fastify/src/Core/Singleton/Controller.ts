import Path from "./Path";
import {RequestHandlerType} from "../CoreTypes";
import {FastifyReply, FastifyRequest} from "fastify";

export class Controller {
    private _controllers: { [key: string]: any } = {};


    methodOf(controller : string,method : string) : RequestHandlerType{
        const m = this.get(controller)[method];

        if(m.constructor.name === 'AsyncFunction')
            return async function (request : FastifyRequest, reply : FastifyReply) {
                reply.send(
                    await m(request,reply)
                );
                await reply;
            }
        return (request : FastifyRequest, reply : FastifyReply,done : Function) =>  m(request,reply,done);
    }

    get(controller : string){
        // path@method
        if(!(controller in this._controllers))
            this._controllers[controller] = new (require(
                `${Path.app(...controller.split('/'))}.controller`
            )).default;
        return this._controllers[controller];
    }
}

export default new Controller();