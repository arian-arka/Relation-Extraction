import {JSONSchemaType} from "ajv";
import {BodyParamsReq, BodyReq, QueryReq, ValidationError} from "../../Core/Class/Request";
import {ReqType} from "../../Core/CoreTypes";
import RelationService from "./Relation.service";
import {IRelation} from "./Relation.interface";
import {IMongoosePagination, MongoosePaginator} from "../../Core/Class/MongooseService";

export interface IRelationStoreRequest {
    name: string,
    description?: string,
}

export class RelationStoreRequest extends BodyReq<IRelationStoreRequest> {
    protected body(): JSONSchemaType<IRelationStoreRequest> | undefined {
        return {
            type: 'object',
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 500},
                description: {type: 'string', minLength: 1, maxLength: 5000,nullable:true},
            },
            additionalProperties: false,
            required: ['name']
        };
    }

    protected async custom(request: ReqType<IRelationStoreRequest, any, any, any>, v: ValidationError): Promise<any> {
        if(await RelationService.exists({name:request.body.name}))
            return v.lang('name','validation.relationStore');

    }
}

export class RelationUpdateRequest extends BodyParamsReq<IRelationStoreRequest,{relation : IRelation}> {
    protected body(): JSONSchemaType<IRelationStoreRequest> | undefined {
        return {
            type: 'object',
            properties: {
                name: {type: 'string', minLength: 1, maxLength: 500},
                description: {type: 'string', minLength: 1, maxLength: 5000,nullable:true},
            },
            additionalProperties: false,
            required: ['name']
        };
    }

    protected async custom(request: ReqType<IRelationStoreRequest, any, {relation : IRelation}, any>, v: ValidationError): Promise<any> {
        if(await RelationService.exists({name:request.body.name,_id:{'$ne':request.params.relation._id}}))
            return v.lang('name','validation.relationStore');

    }
}

export interface IRelationListRequest extends IMongoosePagination {
    name?: string,
}

export class RelationListRequest extends QueryReq<IRelationListRequest> {
    protected query(): JSONSchemaType<IRelationListRequest> | undefined {
        return {
            type: "object",
            properties: {
                ...MongoosePaginator.properties(),
                name: {type: "string", maxLength: 500, nullable: true},
            },

            required: [...MongoosePaginator.required()]
        }
    }
}