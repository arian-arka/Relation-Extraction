import {ApiWithCsrf} from "../../Core/Class/ApiWithCsrf";
import Url from "../../Core/Helper/Url";
import {object, string} from "yup";
import Lang from "../../Core/Helper/Lang";
import {IMongoosePagination, IPaginated} from "../Interface/Mongoose.interface";
import {IUser} from "./User.api";

export interface IRelation {
    _id: string,

    name: string,
    description?: string,

    taggedCount?:number,

    updatedAt: Date,

    createdAt: Date,
}

export interface IRelationStoreRequest {
    name: string,
    description?: string,
}

export interface IRelationListRequest extends IMongoosePagination {
    name?: string,
}

export interface IRelationListResponse extends IPaginated<IRelation> {
}

export default class RelationApi extends ApiWithCsrf{

    async store(body : IRelationStoreRequest){
        return this.fetch<IRelation,IRelationStoreRequest>({
            url: Url.backWithBase('relationStore'),
            method: 'POST',
            body,
            validation: {
                schema: object({
                    name: string().required(Lang.get('errors.string.required', 'name')).min(1).max(500),
                    description: string().notRequired().max(5000),
                }),
            }
        });
    }

    async update(relation : string,body : IRelationStoreRequest){
        return this.fetch<IRelation,IRelationStoreRequest>({
            url: `${Url.backWithBase('relationUpdate')}/${relation}`,
            method: 'PUT',
            body,
            validation: {
                schema: object({
                    name: string().required(Lang.get('errors.string.required', 'name')).min(1).max(500),
                    description: string().notRequired().max(5000),
                }),
            }
        });
    }

    async show(relation : string){
        return this.fetch<IRelation,any>({
            url: `${Url.backWithBase('relationShow')}/${relation}`,
            preFetch:false,
        });
    }

    async list(body : IRelationListRequest){
        return this.fetch<IRelationListResponse,IRelationListRequest>({
            url: `${Url.backWithBase('relationList')}`,
            preFetch:false,
            body
        });
    }

    async destroy(relation : string){
        return this.fetch<any,any>({
            url: `${Url.backWithBase('relationDestroy')}/${relation}`,
            method:'DELETE'
        });
    }


}