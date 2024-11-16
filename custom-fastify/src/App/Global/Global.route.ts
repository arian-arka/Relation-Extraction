import Route from "../../Core/Class/Route";
import {FastifyReply, FastifyRequest} from "fastify";

export default Route.open(async (route: Route) => {
    route.get('/csrf', async (request: FastifyRequest, reply: FastifyReply) => {
        return {'token' : await reply.generateCsrf()}
    });


});