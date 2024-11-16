import UserService from "./User.service";
import {Unauthorized} from "../../Core/Class/Respond";
import {FastifyReply, FastifyRequest} from "fastify";
import {Document, Types} from "mongoose";
import {IUser} from "./User.interface";
import Middleware from "../../Core/Class/Middleware";

async function validateJwt(request: FastifyRequest, reply: FastifyReply) {
    {
        const token = request.cookies?.token ?? '';
        if (!(!!token))
            return false;
        let payload: { _id?: string };
        try {
            payload = request.verifyJwt(token);
        } catch (e) {
            return false;
        }
        if (!(!!payload))
            return false;

        const user = await UserService.one(payload?._id ?? '');
        if (!user)
            return false;
        return user;
    }
}

export class AuthenticatedUserMiddleware extends Middleware {
    public async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const user = await validateJwt(request, reply);
        if (!user)
            throw new Unauthorized;
        console.log('authenticated user : ', user.toObject());
        request.user = user;
    }
}

export class UnAuthenticatedUserMiddleware extends Middleware {
    async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const user = await validateJwt(request, reply);
        if (user) {
            throw Unauthorized.with({
                'user': {...user.toObject(), password: null}
            });
        }
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: (Document<unknown, {}, IUser> & IUser & Required<{ _id: Types.ObjectId }>)
    }
}