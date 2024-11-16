import {FastifyInstance, FastifyRequest} from "fastify";
import * as fastifyCors from "@fastify/cors";
import fp from "fastify-plugin";
// import Cors from "../Config/Cors";
// import {FastifyCorsOptions} from "@fastify/cors";


export default fp(async (fastify) => {
    await fastify.register(fastifyCors, (instance: FastifyInstance) => {
        return (req : FastifyRequest, callback : any) => {
            callback(null, {
                origin: true,
                credentials : true,
            })
        }

        // return (req: FastifyRequest, callback: any) => {
        //     console.log('cookies',req.cookies);
        //     const corsOptions = {
        //         credentials:true,
        //         origin: false
        //     } as FastifyCorsOptions;
        //     console.log('origin : ',req?.headers?.origin ?? '',!!(req?.headers?.origin ?? ''));
        //     if (!!(req?.headers?.origin ?? '')) {
        //         const u = new URL(req?.headers?.origin ?? '');
        //         console.log('hostname: ',u.hostname,' port: ',u.port);
        //         for (let c of Cors) {
        //             if (typeof c === 'function') {
        //                 if (c(req) === true) {
        //                     corsOptions.origin = true;
        //                     break;
        //                 }
        //             } else {
        //                 if (c.port === u.port && c.hostname === u.hostname) {
        //                     corsOptions.origin = true;
        //                     break;
        //                 }
        //             }
        //         }
        //     } else {
        //         corsOptions.origin = true;
        //     }
        //     console.log('cors options',corsOptions);
        //
        //     // callback expects two parameters: error and options
        //     callback(null, corsOptions)
        // }
    });
})

