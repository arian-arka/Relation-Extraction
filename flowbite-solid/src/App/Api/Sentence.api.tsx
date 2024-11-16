import {ApiWithCsrf} from "../../Core/Class/ApiWithCsrf";
import Url from "../../Core/Helper/Url";
import {array, object, string} from "yup";
import Lang from "../../Core/Helper/Lang";
import {IMongoosePagination, IPaginated} from "../Interface/Mongoose.interface";
import {IUser} from "./User.api";
import {IRelation} from "./Relation.api";
import {SENTENCE_STATUS} from "../Constants";

export interface ISentence {
    _id: string,

    words: string,

    entities: ({ start: number, end: number,wikipedia?:string })[],

    relations: ({
        name: string,
        relation: string,
        fromEntity: number,
        toEntity: number,
    })[],

    status: number,

    user?: string,

    reviewer?: string,

    description?: string,

    updatedAt: Date,

    createdAt: Date,
}

export interface IFullSentenceResponse extends Omit<ISentence, '_id' | 'createdAt' | 'updatedAt' | 'reviewer' | 'user' | 'relations'> {
    _id: string,
    user?: IUser,
    reviewer?: IUser,
    relations: ({
        name: string,
        relation: IRelation,
        fromEntity: number,
        toEntity: number,
    })[],
    description?: string,
    updatedAt: string,
    createdAt: string,
}

export interface ISentenceStoreRequest {
    words: string[]
}

export interface ISentenceListRequest extends IMongoosePagination {
    words?: string,
    relation?: string,
    user?: string,
    status?: number,
}

export interface ISentenceListResponse extends IPaginated<IFullSentenceResponse> {
}

export interface ITagSentenceRequest {
    entities: ({ start: number, end: number,wikipedia?:string })[],
    relations: ({
        relation: string,
        fromEntity: number,
        toEntity: number,
    })[],
}

export default class SentenceApi extends ApiWithCsrf {

    async store(body: ISentenceStoreRequest) {
        return this.fetch<ISentence, ISentenceStoreRequest>({
            url: Url.backWithBase('sentenceStore'),
            method: 'POST',
            body,
            validation: {
                schema: object({
                    words: array().required(Lang.get('errors.string.required', 'words'))
                        .of(string().required().min(1).max(500)).min(1).max(2000)
                }),
            }
        });
    }

    async update(sentence: string, body: ISentenceStoreRequest) {
        return this.fetch<IFullSentenceResponse, ISentenceStoreRequest>({
            url: `${Url.backWithBase('sentenceUpdate')}/${sentence}`,
            method: 'PUT',
            body,
            validation: {
                schema: object({
                    words: array().required(Lang.get('errors.string.required', 'words'))
                        .of(string().required().min(1).max(500)).min(1).max(2000)
                }),
            }
        });
    }

    async delete(sentence: string) {
        return this.fetch<any, any>({
            url: `${Url.backWithBase('sentenceDestroy')}/${sentence}`,
            method : "DELETE",
        });
    }
    async show(sentence: string) {
        return this.fetch<IFullSentenceResponse, any>({
            url: `${Url.backWithBase('sentenceShow')}/${sentence}`,
            preFetch: false,
        });
    }

    async list(body: ISentenceListRequest) {
        return this.fetch<ISentenceListResponse, ISentenceListRequest>({
            url: `${Url.backWithBase('sentenceList')}`,
            preFetch: false,
            body
        });
    }

    async tag(sentence: string, body: ITagSentenceRequest) {
        return this.fetch<IFullSentenceResponse, ITagSentenceRequest>({
            url: `${Url.backWithBase('sentenceTag')}/${sentence}`,
            method: 'PUT',
            body,
        });
    }

    async open(sentence: string) {
        return this.fetch<IFullSentenceResponse, any>({
            url: `${Url.backWithBase('sentenceOpen')}/${sentence}`,
            method: 'PUT',
        });
    }

    async status(sentence: string, status: 'await' | 'release') {
        return this.fetch<IFullSentenceResponse, any>({
            url: `${Url.backWithBase('sentenceStatus')}/${sentence}`,
            method: 'PUT',
            body: {status: status === 'await' ? SENTENCE_STATUS.waiting : SENTENCE_STATUS.unchanged}
        });
    }

    async publish(sentence: string, status: 'publish' | 'refuse',description : string) {
        return this.fetch<IFullSentenceResponse, any>({
            url: `${Url.backWithBase('sentencePublish')}/${sentence}`,
            method: 'PUT',
            body: {
                description : !!description ? description : null,
                publish: status === 'publish' ,
            }
        });
    }

    // async destroy(relation : string){
    //     return this.fetch<any,any>({
    //         url: `${Url.backWithBase('relationDestroy')}/${relation}`,
    //         method:'DELETE'
    //     });
    // }


}