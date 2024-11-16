import MongooseService from "../../Core/Class/MongooseService";
import {IRelation} from "./Relation.interface";
import {MRelation} from "./Relation.model";
import {IRelationListRequest} from "./Relation.request";
import Str from "../../Core/Singleton/Str";

class RelationService extends MongooseService<IRelation> {
    constructor() {
        super(MRelation);
    }

    async list(queryParams: IRelationListRequest) {
        const query: any = {};
        if (!!queryParams.name)
            query['name'] = {'$regex': Str.safeString(queryParams.name), '$options': 'i'}
        return this.paginate({
            query,
            linkPerPage: queryParams.linkPerPage,
            limit: queryParams.limit,
            page: queryParams.page,
            sort:{
                name:1
            }
        })
    }
}

export default new RelationService();