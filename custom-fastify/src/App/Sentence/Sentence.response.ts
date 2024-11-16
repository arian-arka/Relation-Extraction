import {JSONSchemaType} from "ajv";
import {Response} from "../../Core/Class/Response";
import {IPaginated, MongoosePaginator} from "../../Core/Class/MongooseService";
import {ISentence} from "./Sentence.interface";
import {IUserResponse} from "../User/User.response";
import {IRelationResponse} from "../Relation/Relation.response";

export interface IFullSentenceResponse extends Omit<ISentence, '_id' | 'createdAt' | 'updatedAt' | 'reviewer' | 'user' | 'relations'> {
    _id: string,
    user?: Omit<IUserResponse, 'createdAt' | 'email' | 'updatedAt'>,
    reviewer?: Omit<IUserResponse, 'createdAt' | 'email' | 'updatedAt'>,
    relations: ({
        name: string,
        relation: Omit<IRelationResponse, 'createdAt' | 'updatedAt' >,
        fromEntity: number,
        toEntity: number,
    })[],
    description?: string,
    updatedAt: string,
    createdAt: string,
}

export interface ISentenceListResponse extends IFullSentenceResponse {
}

export const JSFullSentence : any = {
    type: 'object',
    properties: {
        _id: {type: 'string'},
        words: {type: 'string'},
        entities: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    start: {type: 'number'},
                    end: {type: 'number'},
                    wikipedia:{type:'string',nullable:true}
                },
                required: ['start', 'end'],
                additionalProperties: false,
            }
        },
        relations: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    relation: {
                        type: 'object',
                        properties: {
                            _id: {type: 'string'},
                            name: {type: 'string'},
                            description: {type: 'string', nullable: true},
                        },
                        additionalProperties: false,
                        required: ['_id', 'name']
                    },
                    name: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                    },
                    fromEntity: {
                        type: 'number',
                    },
                    toEntity: {
                        type: 'number',
                    }
                },
                required: ['name', 'relation', 'fromEntity', 'toEntity'],
                additionalProperties: false,
            }
        },
        status: {type: 'number'},
        user: {
            type: 'object',
            properties: {
                _id: {type: 'string'},
                name: {type: "string"},
            },
            additionalProperties: false,
            required: ['_id', 'name'],
            nullable: true,
        },
        reviewer: {
            type: 'object',
            properties: {
                _id: {type: 'string'},
                name: {type: "string"},
            },
            additionalProperties: false,
            required: ['_id', 'name',],
            nullable: true,
        },
        description: {type: 'string', nullable: true},
        updatedAt: {type: 'string'},
        createdAt: {type: 'string'},
    },
    required: ['_id', 'words', 'entities', 'relations', 'status', 'updatedAt', 'createdAt'],
    additionalProperties: false,
};

export class SentenceResponse extends Response<IFullSentenceResponse> {
    schema(): JSONSchemaType<IFullSentenceResponse> {
        return JSFullSentence;
    }
}

export class SentenceListResponse extends Response<IPaginated<ISentenceListResponse>> {
    schema(): JSONSchemaType<IPaginated<ISentenceListResponse>> {
        return {
            type: 'object',
            properties: {
                ...MongoosePaginator.paginationProperties(),
                data: {
                    type: 'array',
                    items: JSFullSentence,
                },
            },
            additionalProperties: false,
            ...MongoosePaginator.paginationRequired()
        }
    }
}

        