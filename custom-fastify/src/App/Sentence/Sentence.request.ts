import {JSONSchemaType} from "ajv";
import {BodyParamsReq, BodyReq, QueryReq, ValidationError} from "../../Core/Class/Request";
import {ISentence} from "./Sentence.interface";
import {IMongoosePagination, MongoosePaginator} from "../../Core/Class/MongooseService";
import {ReqType} from "../../Core/CoreTypes";
import SentenceService from "./Sentence.service";
import {SENTENCE_STATUS} from "./Sentence.constant";
import UserService from "../User/User.service";
import RelationService from "../Relation/Relation.service";

export interface ISentenceStoreRequest {
    words: string[],
}

export class SentenceStoreRequest extends BodyReq<ISentenceStoreRequest> {
    protected body(): JSONSchemaType<ISentenceStoreRequest> | undefined {
        return {
            type: 'object',
            properties: {
                words: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                    },
                    minItems: 1,
                    maxItems: 5000,
                },
            },
            additionalProperties: false,
            required: ['words']
        };
    }

    protected async custom(request: ReqType<ISentenceStoreRequest, any, any, any>, v: ValidationError): Promise<any> {
        const words = request.body.words.join(' ');
        if (await SentenceService.exists({words}))
            return v.lang('words', 'validation.sentence.words')
    }
}

export class SentenceUpdateRequest extends BodyParamsReq<ISentenceStoreRequest, { sentence: ISentence }> {
    protected body(): JSONSchemaType<ISentenceStoreRequest> | undefined {
        return {
            type: 'object',
            properties: {
                words: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                    },
                    minItems: 1,
                    maxItems: 5000,
                },
            },
            additionalProperties: false,
            required: ['words']
        };
    }

    protected async custom(request: ReqType<ISentenceStoreRequest, any, {
        sentence: ISentence
    }, any>, v: ValidationError): Promise<any> {
        const words = request.body.words.join(' ');
        if (await SentenceService.exists({words, _id: {'$ne': request.params.sentence._id}}))
            return v.lang('words', 'validation.sentence.words')
    }
}

export interface ITagSentenceRequest {
    entities: ({ start: number, end: number, wikipedia?: string })[],
    relations: ({
        relation: string,
        fromEntity: number,
        toEntity: number,
    })[],
}

export class TagSentenceRequest extends BodyParamsReq<ITagSentenceRequest, { sentence: ISentence }> {
    protected body(): JSONSchemaType<ITagSentenceRequest> | undefined {
        return {
            type: 'object',
            properties: {
                entities: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            start: {type: 'number'},
                            end: {type: 'number'},
                            wikipedia: {type: 'string', maxLength: 5000, nullable: true}
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
                                type: 'string',
                                minLength: 24,
                                maxLength: 24,
                            },
                            fromEntity: {
                                type: 'number',
                            },
                            toEntity: {
                                type: 'number',
                            }
                        },
                        required: ['relation', 'fromEntity', 'toEntity'],
                        additionalProperties: false,
                    }
                },
            },
            additionalProperties: false,
            required: ['entities', 'relations'],
        }
    }

    protected async custom(request: ReqType<ITagSentenceRequest, any, {
        sentence: ISentence
    }>, v: ValidationError): Promise<any> {
        const body = request.body;
        const sentence = request.params.sentence;
        const words = sentence.words.split(' ');
        if (body.entities.length === 0 && body.relations.length === 0)
            return;

        for (let i = 0; i < body.entities.length; i++) {
            const entity = body.entities[i];
            console.log('i', i);
            if (entity.start > entity.end || entity.start < 0 || entity.end >= words.length)
                return v.set('entities', `Invalid entity ${entity.start} , ${entity.end}`);
            for (let j = 0; j < body.entities.length; j++) {
                console.log('j', j, j === i);
                if (j !== i &&
                    (
                        (entity.start >= body.entities[j].start && entity.start <= body.entities[j].end) ||
                        (entity.end >= body.entities[j].start && entity.end <= body.entities[j].end)
                    ))
                    return v.set('entities', `Has two entities ${entity.start} , ${entity.end}`);
            }
        }


        for (let i = 0; i < body.relations.length; i++) {
            const relation = body.relations[i];
            if (relation.fromEntity > body.entities.length - 1 || relation.fromEntity < 0 || relation.toEntity > body.entities.length - 1 || relation.toEntity < 0 || relation.toEntity === relation.fromEntity)
                return v.set('relations', `Invalid relation ${relation.fromEntity} , ${relation.toEntity}`);
            const r = await RelationService.one(relation.relation);
            if (!r)
                return v.set('relations', 'Invalid relation ref');
            // @ts-ignore
            relation.name = r.name;
            for (let j = 0; j < body.relations.length - 1; j++) {
                if (j !== i && (
                    (relation.fromEntity === body.relations[j].fromEntity && relation.toEntity === body.relations[j].toEntity) ||
                    (relation.toEntity === body.relations[j].fromEntity && relation.fromEntity === body.relations[j].toEntity)
                )
                ) {
                    return v.set('relations', `Has two relation ${relation.fromEntity} , ${relation.toEntity}`);
                }
            }
        }


    }
}

export interface ISentenceListRequest extends IMongoosePagination {
    words?: string,
    relation?: string,
    user?: string,
    hasRelation?:'true' | 'false',
    status: number,
}

export class SentenceListRequest extends QueryReq<ISentenceListRequest> {
    protected query(): JSONSchemaType<ISentenceListRequest> | undefined {
        return {
            type: "object",
            properties: {
                ...MongoosePaginator.properties(),
                words: {
                    type: 'string',
                    maxLength: 5000,
                    nullable: true,
                },
                relation: {
                    type: "string",
                    maxLength: 24,
                    nullable: true,
                },
                user: {
                    type: "string",
                    maxLength: 24,
                    nullable: true,
                },
                status: {
                    type: "number",
                    nullable: true,
                },
                hasRelation : {type:'string',nullable:true},
            },

            required: [...MongoosePaginator.required()]
        }
    }

    protected async custom(request: ReqType<any, ISentenceListRequest, any, any>, v: ValidationError): Promise<any> {
        if (!!request.query.status && !Object.values(SENTENCE_STATUS).includes(request.query.status)) {
            return v.set('status', 'invalid status');
        }
        if (!!request.query.user && !await UserService.one(request.query.user)) {
            return v.set('user', 'invalid user');
        }
        if (!!request.query.relation && !await RelationService.one(request.query.relation)) {
            return v.set('relation', 'invalid relation');
        }
    }

}

export interface IPublishSentenceRequest {
    description?: string,
    publish: boolean,
}

export class PublishSentenceRequest extends BodyParamsReq<IPublishSentenceRequest, { sentence: ISentence }> {
    protected body(): JSONSchemaType<IPublishSentenceRequest> | undefined {
        return {
            type: "object",
            properties: {
                publish: {type: 'boolean'},
                description: {
                    type: 'string',
                    maxLength: 5000,
                    nullable: true,
                }
            },
            required: ['publish'],
            additionalProperties: false
        }
    }
}

export interface IChangeSentenceStatusRequest {
    status: number,
}

export class ChangeSentenceStatusRequest extends BodyParamsReq<IChangeSentenceStatusRequest, { sentence: ISentence }> {
    protected body(): JSONSchemaType<IChangeSentenceStatusRequest> | undefined {
        return {
            type: "object",
            properties: {
                status: {type: 'number',}
            },
            required: ['status'],
            additionalProperties: false
        }
    }

    protected async custom(request: ReqType<IChangeSentenceStatusRequest, {
        sentence: ISentence
    }, any, any>, v: ValidationError): Promise<any> {
        if (![SENTENCE_STATUS.waiting, SENTENCE_STATUS.unchanged].includes(request.body.status))
            return v.set('status', 'Invalid status');
    }
}