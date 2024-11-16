import fp from "fastify-plugin";


export default fp(async (fastify) => {

    await fastify.register(require("@fastify/csrf-protection"), {
         cookieOpts: {signed: false },
    })

    await fastify.decorateRequest('csrfProtection', fastify.csrfProtection);
})

declare module 'fastify' {
    export interface FastifyInstance {
        csrfProtection(...args: any[]): any,
    }

    export interface FastifyRequest {
        csrfProtection(...args: any[]): any,
    }

    export interface FastifyReply {
        generateCsrf(...args: any[]): any,
    }
}
