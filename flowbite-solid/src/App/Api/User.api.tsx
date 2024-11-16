import {ApiWithCsrf} from "../../Core/Class/ApiWithCsrf";
import Url from "../../Core/Helper/Url";
import {object, string} from "yup";
import Lang from "../../Core/Helper/Lang";
import {IMongoosePagination, IPaginated} from "../Interface/Mongoose.interface";

export interface IUser {
    _id: string,

    name: string,

    email: string,

    privileges: number[],

    suspendedAt?: string,

    updatedAt: string,

    createdAt: string,
}

export interface IUserLoginRequest {
    email: string,
    password: string,
}

export interface IUserRegisterRequest {
    name: string,
    email: string,
    password: string,
    privileges?: number[],
}

export interface IUserUpdateRequest {
    name: string,
    email: string,
    password?: string,
}

export interface IUserUpdateProfileRequest {
    name: string,
    email: string,
    password: string,
    newPassword?: string,
}

export interface IUserGrantRequest {
    privileges: number[],
    grant: boolean,
}

export interface IUserListRequest extends IMongoosePagination {
    nameOrEmail?: string,
}

export interface IUserListResponse extends IPaginated<IUser> {
}

export default class UserApi extends ApiWithCsrf {
    async list(body: IUserListRequest) {
        return await this.fetch<IUserListResponse, IUserListRequest>({
            url: Url.backWithBase('userList'),
            preFetch: false,
            body
        });
    }

    async self() {//admin@admin.com
        return await this.fetch<IUser, any>({
            url: Url.backWithBase('userSelf'),
            preFetch: false,
        });
    }

    async logout() {
        return await this.fetch<any, any>({
            url: Url.backWithBase('userLogout'),
            preFetch: false,
        });
    }

    async login(body: IUserLoginRequest) {
        return await this.fetch<IUser, IUserLoginRequest>({
            url: Url.backWithBase('userLogin'),
            method: 'POST',
            body,
            validation: {
                schema: object({
                    email: string().required(Lang.get('errors.string.required', 'email')).email(Lang.get('errors.string.email', 'email')),
                    password: string().required(Lang.get('errors.string.required', 'password'))
                }),
            }
        });
    }

    async store(body: IUserRegisterRequest) {
        return await this.fetch<IUser, IUserRegisterRequest>({
            url: Url.backWithBase('userStore'),
            method: 'POST',
            body,
            validation: {
                schema: object({
                    name: string().required(Lang.get('errors.string.required', 'name')).min(1).max(500),
                    email: string().required(Lang.get('errors.string.required', 'email')).email(Lang.get('errors.string.email', 'email')),
                    password: string().required(Lang.get('errors.string.required', 'password')).min(8).max(64)
                }),
            }
        });
    }

    async updateProfile(body: IUserUpdateProfileRequest) {
        return await this.fetch<IUser, IUserUpdateProfileRequest>({
            url: `${Url.backWithBase('userUpdateProfile')}`,
            method: 'PUT',
            body,
            validation: {
                schema: object({
                    name: string().required(Lang.get('errors.string.required', 'email')).min(1).max(500),
                    email: string().required(Lang.get('errors.string.required', 'email')).email(Lang.get('errors.string.email', 'email')),
                    password: string().required(),
                    newPassword: string().notRequired().min(8).max(64)
                }),
            }
        });
    }

    async grant(user: string, body: IUserGrantRequest) {
        return await this.fetch<IUser, IUserGrantRequest>({
            url: `${Url.backWithBase('userGrant')}/${user}`,
            method: 'PUT',
            body,
        });
    }

    async show(user: string) {
        return await this.fetch<IUser, any>({
            url: `${Url.backWithBase('userShow')}/${user}`,
            preFetch: false,
        });
    }

    async update(user: string, body: IUserUpdateRequest) {
        return await this.fetch<IUser, IUserUpdateRequest>({
            url: `${Url.backWithBase('userUpdate')}/${user}`,
            method: 'PUT',
            body,
            validation: {
                schema: object({
                    name: string().required(Lang.get('errors.string.required', 'email')).min(1).max(500),
                    email: string().required(Lang.get('errors.string.required', 'email')).email(Lang.get('errors.string.email', 'email')),
                    password: string().notRequired().min(8).max(64)
                }),
            }
        });
    }

    async destroy(user: string) {
        return await this.fetch<{}>({
            url: `${Url.backWithBase('userDestroy')}/${user}`,
            method: 'DELETE',
        });
    }

}