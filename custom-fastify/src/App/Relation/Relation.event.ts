import {IRelation} from "./Relation.interface";
import Event from "../../Core/Class/Event";
import {LRelationDeletion, LRelationEdition} from "./Relation.listener";

export class ERelationEdition extends Event<IRelation> {
    protected listeners = [
        LRelationEdition
    ];
}

export class ERelationDeletion extends Event<IRelation> {
    protected listeners = [
        LRelationDeletion
    ];
}