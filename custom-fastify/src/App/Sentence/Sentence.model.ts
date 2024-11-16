import {model, Schema} from "mongoose";
import {ISentence} from "./Sentence.interface";

export const SSentence = new Schema<ISentence>({
    words: String,

    entities: [
        {
            start: Number,
            end: Number,
            wikipedia: {type: String, default: null,}
        }
    ],

    relations: [
        {
            name: String,
            relation: Schema.Types.ObjectId,
            fromEntity: Number,
            toEntity: Number,
        }
    ],

    status: Number,

    user: {type: Schema.Types.ObjectId, ref: 'User', default: null},

    reviewer: {type: Schema.Types.ObjectId, ref: 'User', default: null},

    description: {type: String, default: null},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})

SSentence.index({words: 'text'});
SSentence.index({status: 1});
SSentence.index({user: 1});
SSentence.index({reviewer: 1});

export const MSentence = model<ISentence>('Sentence', SSentence);
        