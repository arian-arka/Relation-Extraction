import fp from "fastify-plugin";
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import CookieConfig from "../Config/Cookie";

export default fp(async (fastify) => {
    await fastify.register(cookie, {
        secret: CookieConfig.key, // for cookies signature
        parseOptions: {
            // sameSite : 'none',
            // domain : '127.0.0.1',
        }     // options for parsing cookies
    } as FastifyCookieOptions)
})

