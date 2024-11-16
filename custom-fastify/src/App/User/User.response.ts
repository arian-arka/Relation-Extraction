import {JSONSchemaType} from "ajv";
import {Response} from "../../Core/Class/Response";
import {IUser} from "./User.interface";
import {IPaginated, MongoosePaginator} from "../../Core/Class/MongooseService";

export interface IUserResponse extends Omit<IUser, '_id' | 'suspendedAt' | 'updatedAt' | 'createdAt' | 'password'> {
    _id: string,
    suspendedAt?: string,
    updatedAt: string,
    createdAt: string,
}

export interface IUserLoginResponse extends IUserResponse{}

export class UserLoginResponse extends Response<IUserLoginResponse> {
    schema(): JSONSchemaType<IUserLoginResponse> {
        return {
            type: 'object',
            properties: {
                _id: {type: 'string'},
                name: {type: "string"},
                email: {type: "string"},
                privileges: {type: "array", items: {type: 'number'}},
                suspendedAt: {type: 'string', nullable: true},
                updatedAt: {type: 'string'},
                createdAt: {type: 'string'},
            },
            additionalProperties: false,
            required: ['_id', 'name', 'email', 'privileges', 'updatedAt', 'createdAt']
        };
    }
}

export interface IUserList {
    _id: string,

    name: string,

    email: string,

    privileges: number[],

    suspendedAt?: string,

    updatedAt: string,

    createdAt: string,
}

export class UserListResponse extends Response<IPaginated<IUserList>> {
    schema(): JSONSchemaType<IPaginated<IUserList>> {
        return {
            type: 'object',
            properties: {
                ...MongoosePaginator.paginationProperties(),
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: {type: 'string'},
                            name: {type: 'string'},
                            email: {type: 'string'},
                            privileges: {
                                type: 'array',
                                items: {type: 'number'}
                            },
                            suspendedAt: {type: 'string', nullable: true},
                            updatedAt: {type: 'string'},
                            createdAt: {type: 'string'},
                        },
                        required: ['_id', 'name', 'email', 'privileges', 'updatedAt', 'createdAt'],
                        additionalProperties: false,
                    }
                },
            },
            additionalProperties: false,
            ...MongoosePaginator.paginationRequired()
        }
    }
}