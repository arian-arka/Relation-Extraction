import Controller from "../../Core/Class/Controller";
import {BodyParamsReqType, BodyReqType, ParamsReqType, QueryReqType} from "../../Core/CoreTypes";
import {IRelation} from "./Relation.interface";
import {IRelationListRequest, IRelationStoreRequest} from "./Relation.request";
import RelationService from "./Relation.service";
import {ERelationDeletion, ERelationEdition} from "./Relation.event";

export default class RelationController extends Controller {
    async show(req: ParamsReqType<{ relation: IRelation }>) {
        return req.params.relation;
    }

    async store(req: BodyReqType<IRelationStoreRequest>) {
        return await RelationService.make(req.body);
    }

    async update(req: BodyParamsReqType<IRelationStoreRequest, { relation: IRelation }>) {
        await RelationService.update(req.params.relation._id, req.body);
        const relation = await RelationService.one(req.params.relation._id);
        await ERelationEdition.fire(relation);
        return relation;
    }

    async destroy(req: ParamsReqType<{ relation: IRelation }>) {
        await ERelationDeletion.fire(req.params.relation);
        await RelationService.destroy(req.params.relation._id);
        return {};
    }

    async list(req: QueryReqType<IRelationListRequest>) {
        return await RelationService.list(req.query);
    }
}