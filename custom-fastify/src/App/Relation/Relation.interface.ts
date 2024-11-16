import {Types} from "mongoose";

export interface IRelation {
    _id: Types.ObjectId,

    name: string,

    description?: string,

    taggedCount?:number,

    updatedAt: Date,

    createdAt: Date,
}