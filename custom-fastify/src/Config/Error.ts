import {FastifyReply, FastifyRequest} from "fastify";
import {ValidationError} from "../Core/Class/Request";

const ErrorConfig = {
    'csrf': (request: FastifyRequest, reply: FastifyReply) => {
        reply.status(419).send({
            'message': 'csrf mismatch.'
        });
    },

    'badRequest': (error: ValidationError, request: FastifyRequest, reply: FastifyReply) => {
        reply.status(400).send({messages : error.messages()});
    },

    'default': (request: FastifyRequest, reply: FastifyReply) => {
        reply.status(500).send({
            'message': 'internal server error.'
        });
    }
}

export default ErrorConfig;