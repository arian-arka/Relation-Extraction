import Controller from "../../Core/Class/Controller";
import UserService from "../User/User.service";
import {IEntitiesCountResponse} from "./Report.response";
import RelationService from "../Relation/Relation.service";
import SentenceService from "../Sentence/Sentence.service";

export default class ReportController extends Controller{
    async entitiesCount() : Promise<IEntitiesCountResponse>{
        return {
            users : await UserService.count(),
            relations : await RelationService.count(),
            sentences: await SentenceService.count(),
        };
    }
}