import {FastifyPluginAsync} from "fastify";
import {AppOptions} from "../app";
import {generateRoutes} from "./Class/Route";
import {plugins} from "../Plugins/providers";


const CorePlugin: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {

    for (let p of plugins)
        await fastify.register(p);


    // for (let m of globalMiddlewares) { // @ts-ignore
    //     await fastify.addHook('preHandler', m.make());
    // }



    await generateRoutes(fastify);


}

export default CorePlugin;