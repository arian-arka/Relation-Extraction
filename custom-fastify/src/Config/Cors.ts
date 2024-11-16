import {FastifyRequest} from "fastify";

const CorsConfig: ({
    port : string,
    hostname : string,
} | ((request : FastifyRequest) => boolean|void))[] = [
    {
        hostname : 'localhost',
        port : '3000',
    },
    {
        hostname : '194.225.229.227',
        port : '3000',
    },
    {
        hostname : '194.225.229.227',
        port : '4000',
    },
    {
        hostname : '194.225.229.227',
        port : '80',
    },
    {
        hostname : 'localhost',
        port : '4000',
    },
    {
        hostname : '127.0.0.1',
        port : '3000',
    },
    {
        hostname : '127.0.0.1',
        port : '4000',
    }
]

export default CorsConfig;