import {ApiWithCsrf} from "../../Core/Class/ApiWithCsrf";
import Url from "../../Core/Helper/Url";


export interface IEntitiesCountResponse {
    users:number,
    sentences:number,
    relations : number,
}

export default class ReportApi extends ApiWithCsrf{

    async entitiesCount(){
        return this.fetch<IEntitiesCountResponse,any>({
            url: `${Url.backWithBase('reportEntitiesCount')}`,
            preFetch:false,
        });
    }

}