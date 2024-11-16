import {JSONSchemaType} from "ajv";
import {Response} from "../../Core/Class/Response";
import {IPaginated, MongoosePaginator} from "../../Core/Class/MongooseService";
import {IRelation} from "./Relation.interface";

export interface IRelationResponse extends Omit<IRelation, '_id' | 'createdAt' | 'updatedAt'> {
    _id: string,
    updatedAt: string,
    createdAt: string,
}

export class RelationResponse extends Response<IRelationResponse> {
    schema(): JSONSchemaType<IRelationResponse> {
        return {
            type: 'object',
            properties: {
                _id: {type: 'string'},
                name: {type: "string"},
                description: {type: "string",nullable:true},
                taggedCount:{type:"number",nullable:true},
                updatedAt: {type: 'string'},
                createdAt: {type: 'string'},
            },
            additionalProperties: false,
            required: ['_id', 'name',  'updatedAt', 'createdAt']
        };
    }
}

export interface IRelationListResponse  extends IRelationResponse {}

export class RelationListResponse extends Response<IPaginated<IRelationListResponse>> {
    schema(): JSONSchemaType<IPaginated<IRelationListResponse>> {
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
                            taggedCount:{type:"number",nullable:true},
                            description: {type: "string",nullable:true},
                            updatedAt: {type: 'string'},
                            createdAt: {type: 'string'},
                        },
                        required: ['_id', 'name', 'updatedAt', 'createdAt'],
                        additionalProperties: false,
                    }
                },
            },
            additionalProperties: false,
            ...MongoosePaginator.paginationRequired()
        }
    }
}