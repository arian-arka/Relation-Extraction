import {Types} from "mongoose";
import {IFullSentenceResponse} from "./Sentence.response";

export interface ISentence {
    _id: Types.ObjectId,

    words: string,

    entities: ({ start: number, end: number,wikipedia?:string })[],

    relations: ({
        name: string,
        relation: Types.ObjectId,
        fromEntity: number,
        toEntity: number,
    })[],

    status: number,

    user?: Types.ObjectId,

    reviewer?: Types.ObjectId,

    description?:string,

    updatedAt: Date,

    createdAt: Date,
}

export interface IFullSentence extends IFullSentenceResponse{}
        