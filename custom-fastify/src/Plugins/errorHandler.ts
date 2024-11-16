import {FastifyError, FastifyReply, FastifyRequest} from "fastify";
import fp from "fastify-plugin";
import Errors from "../Config/Error";
import {ValidationError} from "../Core/Class/Request";
import {Respond} from "../Core/Class/Respond";


export default fp(async (fastify) => {


    await fastify.setErrorHandler(async function (error: any | FastifyError, request: FastifyRequest, reply: FastifyReply) {
        console.log('error', error);

        if (error instanceof ValidationError)
            await Errors.badRequest(error, request, reply);
        else if(error instanceof Respond)
            await error.reply(reply);
        else if (error.statusCode === 403)
            await Errors.csrf(request, reply);
        else
            reply.send(error)

        await reply;
    });


});