import {model, Schema} from "mongoose";
import {IRelation} from "./Relation.interface";

export const SRelation = new Schema<IRelation>({
    name: String,
    description: {type: String, default: null},
    taggedCount: {type: Number, default: 0},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})

SRelation.index({name: 'text'});

export const MRelation = model<IRelation>('Relation', SRelation);