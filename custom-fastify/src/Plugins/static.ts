import fp from "fastify-plugin";
import * as fastifyStatic from "@fastify/static";
import Path from "../Core/Singleton/Path";


export default fp(async (fastify) => {
    await fastify.register(fastifyStatic, {
        root: Path.src('../public'),
        //root: Path.srcPath('../public',),
        prefix: '/', // optional: default '/',
    })

    fastify.setNotFoundHandler(async (req,res) => {
        res.sendFile('index.html');
        await res;
    })
})

declare module 'fastify' {

}