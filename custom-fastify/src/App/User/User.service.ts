import MongooseService from "../../Core/Class/MongooseService";
import {IUser} from "./User.interface";
import {MUser} from "./User.model";
import {Types} from "mongoose";
import {IUserList} from "./User.request";
import Str from "../../Core/Singleton/Str";

class UserService extends MongooseService<IUser> {
    constructor() {
        super(MUser);
    }

    async findByEmail(email: string) {
        return this.model.findOne({email}).exec();
    }

    async grant(_id: Types.ObjectId, privileges: number[], grant: boolean): Promise<boolean> {
        if (!grant)
            return await this.update(_id, {
                '$pull': {
                    'privileges': {'$in': privileges}
                }
            });
        return await this.update(_id, {
            '$addToSet': {
                'privileges': {'$each': privileges}
            }
        });
    }

    async list(queryParams: IUserList) {
        const query: any = {};
        if (!!queryParams.nameOrEmail)
            query['$or'] = [
                {email: queryParams.nameOrEmail},
                {name: {'$regex': Str.safeString(queryParams.nameOrEmail), '$options': 'i'}},
                // {'$regex': Str.safeString(queryParams.nameOrEmail), '$options': 'i'}
            ];
        return this.paginate({
            query,
            linkPerPage:queryParams.linkPerPage,
            limit:queryParams.limit,
            page:queryParams.page,
        })
    }
}

export default new UserService();