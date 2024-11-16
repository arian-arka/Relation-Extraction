import MongooseService from "../../Core/Class/MongooseService";
import {ISentence} from "./Sentence.interface";
import {MSentence} from "./Sentence.model";
import {ISentenceListRequest} from "./Sentence.request";
import {Types} from "mongoose";
import Str from "../../Core/Singleton/Str";
import {MRelation} from "../Relation/Relation.model";
import RelationService from "../Relation/Relation.service";

class SentenceService extends MongooseService<ISentence> {
    constructor() {
        super(MSentence);
    }

    async list(queryParams: ISentenceListRequest) {
        const query: any = {};
        console.log('queryParams', queryParams);
        if (!!queryParams.user)
            query['user'] = new Types.ObjectId(queryParams.user);
        if (!!queryParams.words)
            query['words'] = {'$regex': Str.safeString(queryParams.words), '$options': 'i'};
        if (!!queryParams.status)
            query['status'] = queryParams.status;
        if (!!queryParams.relation)
            query['relations.relation'] = new Types.ObjectId(queryParams.relation);
        else {
            if (queryParams.hasRelation === 'true')
                query['relations'] = {'$exists': true, '$type': 'array', '$ne': []}
            else   if (queryParams.hasRelation === 'false')
                query['$or'] = [
                    {
                        'relations' : {
                            '$exists': false,
                        }
                    },
                    {
                        'relations' : {'$eq': null,}
                    },
                    {
                        'relations' : {
                            '$type': 'array',
                            '$size': 0
                        }
                    }
                ]
        }


        return await this.paginate({
            query,
            linkPerPage: queryParams.linkPerPage,
            limit: queryParams.limit,
            page: queryParams.page,
            populate: [
                {
                    'path': 'user',
                    'select': ['_id', 'name']
                },
                {
                    'path': 'reviewer',
                    'select': ['_id', 'name']
                },
                {
                    'path': 'relations.relation',
                    'select': ['_id', 'name', 'description'],
                    'model': MRelation,
                },
            ]
        });
    }

    async fullOne(_id: string | Types.ObjectId) {
        return super.one(_id, [
            {
                'path': 'user',
                'select': ['_id', 'name']
            },
            {
                'path': 'reviewer',
                'select': ['_id', 'name']
            },
            {
                'path': 'relations.relation',
                'select': ['_id', 'name', 'description'],
                'model': MRelation,
            },
        ]);
    }

    async incRelationsCount(sentenceId : string|Types.ObjectId,count : number){
        for (let r of (await this.oneOrFail(sentenceId))?.relations ?? [])
            await RelationService.update(r.relation, {
                '$inc': {taggedCount: count}
            })
    }

}

export default new SentenceService();

        