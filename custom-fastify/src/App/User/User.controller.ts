import Controller from "../../Core/Class/Controller";
import {BodyParamsReqType, BodyReqType, ParamsReqType, QueryReqType, ReqType} from "../../Core/CoreTypes";
import {
    IUserGrant,
    IUserList,
    IUserLogin,
    IUserRegister,
    IUserStore,
    IUserUpdate,
    IUserUpdateProfile
} from "./User.request";
import {FastifyReply, FastifyRequest} from "fastify";
import UserService from "./User.service";
import Hash from "../../Core/Singleton/Hash";
import {BadRequest} from "../../Core/Class/Respond";
import Lang from "../../Core/Singleton/Lang";
import {EUserDeletion} from "./User.event";
import {IUser} from "./User.interface";

export default class UserController extends Controller {

    async self(req: FastifyRequest) {
        return req.user;
    }

    async register(req: BodyReqType<IUserRegister>) {
        return await UserService.make({...req.body, password: await Hash.make(req.body.password)});
    }

    async logout(req: ReqType, reply: FastifyReply) {
        reply.clearCookie('token');
        reply.unsignCookie('token');
        return {};
    }

    async login(req: BodyReqType<IUserLogin>, reply: FastifyReply) {
        const user = await UserService.findByEmail(req.body.email);
        if (!user || !await Hash.check(user.password, req.body.password))
            throw BadRequest.messages(Lang.pair('email', 'validation.userLogin.email'));

        const token = req.signJwt({
            _id: user._id.toString()
        }, {expiresIn: '12h'});
        reply.setCookie('token', token,{path:'/'});
        console.log('-----------------');
        console.log({...user.toObject(), password: '',_id:user._id.toString()});
        return user;
    }

    async store(req: BodyReqType<IUserStore>) {
       return await UserService.make({...req.body, password: await Hash.make(req.body.password)});
    }

    async show(req: ParamsReqType<{ user: IUser }>) {
        return req.params.user;
    }

    async list(req: QueryReqType<IUserList>) {
        return await UserService.list(req.query);
    }

    async updateProfile(req: BodyReqType<IUserUpdateProfile>) {
        await UserService.update(req.user._id, {
            name: req.body.name,
            email: req.body.email,
            password: !!req.body.newPassword ? await Hash.make(req.body.newPassword) : req.user.password,
        });
        return await UserService.one(req.user._id);
    }

    async update(req: BodyParamsReqType<IUserUpdate, { user: IUser }>) {
        await UserService.update(req.params.user._id, req.body);
        return await UserService.one(req.params.user._id);
    }

    async grant(req: BodyParamsReqType<IUserGrant, { user: IUser }>) {
        await UserService.grant(req.params.user._id, req.body.privileges, req.body.grant);
        return await UserService.one(req.params.user._id);
    }

    async destroy(req: ParamsReqType<{ user: IUser }>) {
        await EUserDeletion.fire(req.params.user);
        await UserService.delete(req.params.user._id);
        return {};
    }
}