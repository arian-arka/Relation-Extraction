import fp from "fastify-plugin";
import fastifyJwt = require('@fastify/jwt');
import JwtConfig from "../Config/Jwt";


export default fp(async (fastify) => {
    await fastify.register(fastifyJwt,{
        secret : JwtConfig.key,
        cookie: {
            cookieName: 'token',
            signed : true,
        },
    });
    await fastify.decorateRequest ('signJwt', fastify.jwt.sign);
    await fastify.decorateRequest ('verifyJwt', fastify.jwt.verify);


})

declare module 'fastify' {
    export interface FastifyRequest {
        signJwt : fastifyJwt.JWT['sign'],
        verifyJwt : fastifyJwt.JWT['verify'],
    }

}