import {model, Schema} from "mongoose";
import {IUser} from "./User.interface";

export const SUser = new Schema<IUser>({
    name: String,
    email: {type: String},
    password: String,
    privileges: {type: [Number],default:[]},
    suspendedAt : { type : Date, default: null },
},{
    timestamps:{
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
    }
})

SUser.index({email: 'text'});

export const MUser = model<IUser>('User',SUser);