import {Listener} from "../../Core/Class/Event";
import {IUser} from "./User.interface";
import SentenceService from "../Sentence/Sentence.service";


export class LUserDeletion extends Listener<IUser> {
    async dispatch(props: IUser) {
        await SentenceService.updateMany({
            'user': props._id
        }, {'user': null});
        await SentenceService.updateMany({
            'reviewer': props._id
        }, {'reviewer': null});
    }
}