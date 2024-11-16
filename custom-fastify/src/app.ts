import {AutoloadPluginOptions} from '@fastify/autoload';
import {FastifyPluginAsync, FastifyServerOptions} from 'fastify';
import CorePlugin from "./Core/CorePlugin";

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {

  await fastify.register(CorePlugin);

};

export default app;
export { app, options }
