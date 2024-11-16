import fp from "fastify-plugin";
import DBConfig from "../Config/DB";
import * as mongoose from "mongoose";
import Global from "../Core/Singleton/Global";

export type MongooseConnectionsType = {
    [key: string]: {
        connection: typeof mongoose,
        close: () => void,
    }
};

export default fp(async (fastify) => {
    const connections: MongooseConnectionsType = {};
    for (let con in DBConfig.mongoose) {
        connections[con] = {
            'connection': await mongoose.connect(DBConfig.mongoose[con]),
            'close': async function () {
                await this.connection.connection.close();
            }
        }
    }

    await fastify.decorate('mongooseConnections', connections);

    Global.set('mongooseConnections', connections);

    fastify.addHook('onClose', async (instance) => {
        for (let con in instance.mongooseConnections)
            await instance.mongooseConnections[con].close();
    })

})
declare module 'fastify' {
    export interface FastifyInstance {
        mongooseConnections: MongooseConnectionsType,
    }
}

