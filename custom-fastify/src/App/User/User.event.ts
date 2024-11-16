import Event from "../../Core/Class/Event";
import {IUser} from "./User.interface";
import {LUserDeletion} from "./User.listener";

export class EUserDeletion extends Event<IUser>{
    protected listeners = [
        LUserDeletion
    ];
}


