import {FilterQuery, Model, PipelineStage, PopulateOptions, Types, UpdateQuery} from "mongoose";
import {BadRequest, NotFound} from "./Respond";
import Str from "../Singleton/Str";

export interface IMongoosePagination {
    page: number,
    linkPerPage: number,
    limit: number,
    sort?: number,
}

export interface IPaginated<Interface> {
    pagination: {
        pages: number[]
        next: number,
        current: number,
        previous: number,
        total: number,
        totalSoFar: number,
        lastPage: number,
        firstPage: number,
        end: boolean
    },
    data: Interface[]
}

export class MongoosePaginator {
    private static generatePages(page: number, linkPerPage: number, lastPage: number): number[] {
        const pages = [];
        let i;
        if (page > 0) {
            const half = Math.floor(linkPerPage / 2);
            let diff = half - page + 1;
            if (diff < 0)
                diff = 0;
            for (i = diff; i < half; i++) {
                let tmpPage = page - half + i;
                if (tmpPage > 0)
                    pages.push(tmpPage);
            }
            pages.push(page);
            let j = 1;
            for (i = i + 1; i < linkPerPage + diff; i++) {
                let tmpPage = page + j++;
                if (tmpPage <= lastPage)
                    pages.push(tmpPage);
            }
        }
        return pages;
    }

    static paginationProperties():{
        pagination: {
            type: 'object',
            properties: {
                pages: {
                    type: 'array',
                    items: {type: 'number'}
                },
                next: {type: 'number'},
                current: {type: 'number'},
                previous: {type: 'number'},
                total: {type: 'number'},
                totalSoFar: {type: 'number'},
                lastPage: {type: 'number'},
                firstPage: {type: 'number'},
                end: {type: 'boolean'},
            },
            additionalProperties: false,
            required: ['pages', 'next', 'current', 'previous', 'total', 'totalSoFar', 'lastPage', 'firstPage', 'end'],
        },
    }{
        return {
            pagination: {
                type: 'object',
                properties: {
                    pages: {
                        type: 'array',
                        items: {type: 'number'}
                    },
                    next: {type: 'number'},
                    current: {type: 'number'},
                    previous: {type: 'number'},
                    total: {type: 'number'},
                    totalSoFar: {type: 'number'},
                    lastPage: {type: 'number'},
                    firstPage: {type: 'number'},
                    end: {type: 'boolean'},
                },
                additionalProperties: false,
                required: ['pages', 'next', 'current', 'previous', 'total', 'totalSoFar', 'lastPage', 'firstPage', 'end'],
            },
        };
    }

    static paginationRequired(): {
        required: ['pagination', 'data']
    }{
        return {
            required: ['pagination', 'data']
        };
    }

    static defaults = {
        limit: 20,
        linkPerPage: 5,
    }

    static async make<Interface>(
        model: Model<Interface>,
        props: {
            query: PipelineStage[] | { [key: string]: any },
            populate?: (string | any)[],
            sort?: { [key: string]: -1 | 1 },
            linkPerPage?: number,
            limit?: number,
            page?: number,
        }
    ): Promise<IPaginated<Interface>> | never {
        const isAgreggate = Array.isArray(props.query);
        const page = props?.page ?? 1;
        const limit = props?.limit ?? this.defaults.limit;
        const skip = (page - 1) * limit;

        let total;
        if (isAgreggate) {
            total = await model.aggregate([...props.query as PipelineStage[], {'$count': "___total___"}]).exec();
            total = total.length === 0 ? 0 : total[0].___total___;
        } else { // @ts-ignore
            total = await model.countDocuments(props.query);
        }
        const lastPage = total <= limit ? 1 : ((total % limit === 0 ? 0 : 1) + Math.floor(total / limit));
        if (lastPage < page)
            throw BadRequest.messages({'page': 'invalid page'});

        let query = props.query;

        if (isAgreggate) {
            query = props?.sort ? [...query as PipelineStage[], {'$sort': props.sort}] : [...query as PipelineStage[]];
            query.push({'$skip': skip});
            query.push({'$limit': limit});
            query = model.aggregate(query as PipelineStage[]);
        } else {
            query = model.find({...props.query} as object);
            if (props.sort)
                query.sort(props.sort);
            for (let p of props?.populate ?? [])
                query.populate(p);
            query.limit(limit).skip(skip);
        }

        const data = await query.exec();
        return {
            data,
            pagination: {
                pages: this.generatePages(page, props?.linkPerPage ?? this.defaults.linkPerPage, lastPage),
                current: lastPage === 1 ? 1 : page,
                next: lastPage > 1 && page < lastPage ? page + 1 : 0,
                previous: page > 1 ? page - 1 : 0,
                total,
                totalSoFar: skip + data.length,
                firstPage: 1,
                lastPage,
                end: page === lastPage,
            }
        }
    }

    static properties(): {
        page: { type: "number", minimum: 1 },
        linkPerPage: { type: "number", minimum: 1, maximum: 10 },
        limit: { type: "number", minimum: 1, maximum: 500 },
        sort: { type: "number", minimum: 0, maximum: 20, nullable: true },
    } {
        return {
            page: {type: "number", minimum: 1},
            linkPerPage: {type: "number", minimum: 1, maximum: 10},
            limit: {type: "number", minimum: 1, maximum: 500},
            sort: {type: "number", minimum: 0, maximum: 20, nullable: true},
        };
    }

    static required(): ['page', 'limit', 'linkPerPage'] {
        return ['page', 'limit', 'linkPerPage'];
    }
}

export default class MongooseService<Interface> {
    constructor(protected readonly model: Model<Interface>) {
    }

    async make(data: any) {
        const _ = new this.model(data);
        await _.save();
        return _;
    }

    async one(_id: string | Types.ObjectId,populate: PopulateOptions | (PopulateOptions | string)[] = []) {
        if (!Str.isValidObjectId(_id))
            return null;
        const _ = await this.model.findOne({_id}).populate(populate).exec();
        return _ ? _ : null;
    }

    async oneOrFail(_id: any) {
        const _ = await this.one(_id);
        if (!_)
            throw new NotFound;
        return _;
    }

    async destroy(_id: string | Types.ObjectId | null | undefined) {
        return (await this.model.deleteOne({_id}).exec()).acknowledged;
    }

    async paginate(props: {
        query: PipelineStage[] | { [key: string]: any },
        populate?: (string | any)[],
        sort?: { [key: string]: -1 | 1 },
        linkPerPage?: number,
        limit?: number,
        page?: number,
    }) {
        return await MongoosePaginator.make<Interface>(this.model, props);
    }

    async exists(filter: FilterQuery<Interface>) {
        return await this.model.exists(filter).exec();
    }

    async update(_id: Types.ObjectId | string, query : UpdateQuery<Interface>) {
        return (await this.model.updateOne({_id}, query).exec()).acknowledged;
    }

    async updateMany(filter : FilterQuery<Interface> | undefined,query : UpdateQuery<Interface>){
        return (await this.model.updateMany(filter,query).exec()).acknowledged;
    }

    async delete(_id: Types.ObjectId | string) {
        return (await this.model.deleteOne({_id}).exec()).acknowledged;
    }

    async deleteMany(filter : FilterQuery<Interface> | undefined){
        return (await this.model.deleteMany(filter)).acknowledged;
    }

    async count(filter : FilterQuery<Interface> | undefined = undefined){
        return await this.model.countDocuments(filter).exec();
    }
}

