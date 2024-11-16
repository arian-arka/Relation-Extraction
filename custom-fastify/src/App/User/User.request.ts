import {JSONSchemaType} from "ajv";
import {BodyParamsReq, BodyReq, QueryReq, ValidationError} from "../../Core/Class/Request";
import {ReqType} from "../../Core/CoreTypes";
import {USER_PRIVILEGES} from "./User.constant";
import UserService from "./User.service";
import {IUser} from "./User.interface";
import {IMongoosePagination, MongoosePaginator} from "../../Core/Class/MongooseService";
import Hash from "../../Core/Singleton/Hash";

export interface IUserLogin {
    email: string,
    password: string,
}

export class UserLoginRequest extends BodyReq<IUserLogin> {
    protected body(): JSONSchemaType<IUserLogin> | undefined {
        return {
            type: 'object',
            properties: {
                email: {type: 'string', minLength: 1, maxLength: 340, format: 'email'},
                password: {type: 'string', minLength: 1, maxLength: 64}
            },
            additionalProperties: false,
            required: ['email', 'password']
        }
    }

    protected async custom(request: ReqType<IUserLogin, any, any, any>, v: ValidationError): Promise<any> {
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    }
}

export interface IUserRegister {
    name: string,
    email: string,
    password: string,
    privileges?: number[],
}

export class UserRegisterRequest extends BodyReq<IUserRegister> {
    protected body(): JSONSchemaType<IUserRegister> | undefined {
        return {
            type: 'object',
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 500},
                email: {type: 'string', minLength: 1, maxLength: 340, format: 'email'},
                password: {type: 'string', minLength: 1, maxLength: 64},
                privileges: {
                    type: 'array',
                    items: {type: 'number'},
                    minItems: 0,
                    maxItems: Object.keys(USER_PRIVILEGES).length,
                    nullable: true,
                }
            },
            additionalProperties: false,
            required: ['email', 'password', 'name']
        }
    }

    protected async custom(request: ReqType<IUserRegister, any, any, any>, v: ValidationError): Promise<any> {
        if (await UserService.exists({email: request.body.email}))
            return v.lang('email', 'validation.userRegister.emailExists');
        const ps = Object.values(USER_PRIVILEGES);
        for (let p of request.body.privileges ?? []) {
            if (!ps.includes(p)) {
                return v.lang('privileges', 'validation.userRegister.invalidPrivilege');
            }
        }
    }
}

export interface IUserStore {
    name: string,
    email: string,
    password: string,
}

export class UserStoreRequest extends BodyReq<IUserStore> {
    protected body(): JSONSchemaType<IUserStore> | undefined {
        return {
            type: 'object',
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 500},
                email: {type: 'string', minLength: 1, maxLength: 340, format: 'email'},
                password: {type: 'string', minLength: 1, maxLength: 64},
            },
            additionalProperties: false,
            required: ['email', 'password', 'name']
        }
    }

    protected async custom(request: ReqType<IUserStore, any, any, any>, v: ValidationError): Promise<void> {
        if (await UserService.exists({email: request.body.email}))
            v.lang('email', 'validation.userRegister.emailExists');
    }
}

export interface IUserUpdateProfile {
    name: string,
    email: string,
    password: string,
    newPassword?: string,
}

export class UserUpdateProfileRequest extends BodyReq <IUserUpdateProfile> {
    protected body(): JSONSchemaType<IUserUpdateProfile> | undefined {
        return {
            type: 'object',
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 500},
                email: {type: 'string', minLength: 1, maxLength: 340, format: 'email'},
                password: {type: 'string', minLength: 1, maxLength: 64},
                newPassword: {type: 'string', minLength: 1, maxLength: 64, nullable: true},
            },
            additionalProperties: false,
            required: ['email', 'name', 'password']
        }
    }

    protected async custom(request: ReqType<IUserUpdateProfile>, v: ValidationError): Promise<any> {
        if (await UserService.exists({email: request.body.email, _id: {'$ne': request.user._id}}))
            return v.lang('email', 'validation.userRegister.emailExists');
        if (!await Hash.check(request.user.password, request.body.password))
            return v.lang('password', 'validation.userRegister.invalidPassword');
    }
}

export interface IUserUpdate {
    name: string,
    email: string,
    password?: string,
}

export class UserUpdateRequest extends BodyParamsReq<IUserUpdate, { user: IUser }> {
    protected body(): JSONSchemaType<IUserUpdate> | undefined {
        return {
            type: 'object',
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 500},
                email: {type: 'string', minLength: 1, maxLength: 340, format: 'email'},
                password: {type: 'string', minLength: 1, maxLength: 64, nullable: true},
            },
            additionalProperties: false,
            required: ['email', 'name']
        }
    }

    protected async custom(request: ReqType<IUserUpdate, any, {
        user: IUser
    }, any>, v: ValidationError): Promise<void> {
        if (await UserService.exists({email: request.body.email, _id: {'$ne': request.params.user._id}}))
            v.lang('email', 'validation.userRegister.emailExists');
    }
}

export interface IUserGrant {
    privileges: number[],
    grant: boolean,
}

export class UserGrantRequest extends BodyParamsReq<IUserGrant, { user: IUser }> {
    protected body(): JSONSchemaType<IUserGrant> | undefined {
        return {
            type: 'object',
            properties: {
                privileges: {
                    type: "array",
                    items: {type: 'number'},
                    minItems: 1,
                    maxItems: 1000,
                },
                grant: {type: "boolean"},
            },
            additionalProperties: false,
            required: ['privileges', 'grant']
        }
    }

    protected async custom(request: ReqType<IUserGrant, any, { user: IUser }, any>, v: ValidationError): Promise<void> {
        const ps = Object.values(USER_PRIVILEGES);
        for (let p of request.body.privileges)
            if (!ps.includes(p))
                v.lang('privileges', 'validation.userGrant.invalidPrivilege')
    }
}

export interface IUserList extends IMongoosePagination {
    nameOrEmail?: string,
}

export class UserListRequest extends QueryReq<IUserList> {
    protected query(): JSONSchemaType<IUserList> | undefined {
        return {
            type: "object",
            properties: {
                ...MongoosePaginator.properties(),
                nameOrEmail: {type: "string", maxLength: 5000, nullable: true},
            },

            required: [...MongoosePaginator.required()]
        }
    }
}