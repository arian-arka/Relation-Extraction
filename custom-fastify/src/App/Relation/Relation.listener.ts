import {Listener} from "../../Core/Class/Event";
import {IRelation} from "./Relation.interface";
import SentenceService from "../Sentence/Sentence.service";

export class LRelationEdition extends Listener<IRelation>{
    async dispatch(props: IRelation): Promise<void> {
        await SentenceService.updateMany({
            'relations.relation': props._id
        },{
            '$set' : {
                'relations.$[].name' : props.name,
            }
        });
    }
}

export class LRelationDeletion extends Listener<IRelation>{
    async dispatch(props: IRelation): Promise<void> {
        await SentenceService.updateMany({},{
            '$pull' : {
                'relations' : {'relation' : props._id},
            }
        });
    }
}