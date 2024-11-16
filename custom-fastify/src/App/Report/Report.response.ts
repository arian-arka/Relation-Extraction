import {Response} from "../../Core/Class/Response";
import {JSONSchemaType} from "ajv";

export interface IEntitiesCountResponse {
    users:number,
    sentences:number,
    relations : number,
}

export class EntitiesCountResponse extends Response<IEntitiesCountResponse> {
    schema(): JSONSchemaType<IEntitiesCountResponse> {
        return {
            type: 'object',
            properties: {
                relations: {type: 'number'},
                sentences: {type: 'number'},
                users: {type: 'number'},
            },
            additionalProperties: false,
            required: ['relations', 'sentences',  'users']
        };
    }
}