import {Can} from "../../Core/Class/Can";
import {ReqType} from "../../Core/CoreTypes";
import {USER_PRIVILEGES} from "./User.constant";
import {Forbidden} from "../../Core/Class/Respond";
import {FastifyReply} from "fastify";

export class CUser extends Can{
    async handle(request : ReqType,reply : FastifyReply,can : string){
        // @ts-ignore
        if(!request.user.privileges.includes(USER_PRIVILEGES[can]))
            throw new Forbidden;
    }
}
