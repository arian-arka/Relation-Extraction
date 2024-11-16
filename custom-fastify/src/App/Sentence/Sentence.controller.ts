import Controller from "../../Core/Class/Controller";
import {BodyParamsReqType, BodyReqType, ParamsReqType, QueryReqType} from "../../Core/CoreTypes";
import {IFullSentence, ISentence} from "./Sentence.interface";
import {
    IChangeSentenceStatusRequest,
    IPublishSentenceRequest,
    ISentenceListRequest,
    ISentenceStoreRequest,
    ITagSentenceRequest
} from "./Sentence.request";
import SentenceService from "./Sentence.service";
import {SENTENCE_STATUS} from "./Sentence.constant";

export default class SentenceController extends Controller {
    async list(req: QueryReqType<ISentenceListRequest>) {
        return await SentenceService.list(req.query);
    }

    async open(req: ParamsReqType<{ sentence: ISentence }>) {
        await SentenceService.update(req.params.sentence._id, {
            status: SENTENCE_STATUS.editing,
            user: req.user._id,
        });
        return await SentenceService.fullOne(req.params.sentence._id);
    }

    async tag(req: BodyParamsReqType<ITagSentenceRequest, { sentence: ISentence }>) {
        await SentenceService.incRelationsCount(req.params.sentence._id, -1);

        await SentenceService.update(req.params.sentence._id, {
            ...req.body,
            user: req.user._id,
        });

        await SentenceService.incRelationsCount(req.params.sentence._id, 1);

        return await SentenceService.fullOne(req.params.sentence._id);
    }

    async publish(req: BodyParamsReqType<IPublishSentenceRequest, { sentence: ISentence }>) {
        await SentenceService.update(req.params.sentence._id, {
            reviewer: req.user._id,
            status: req.body.publish ? SENTENCE_STATUS.published : SENTENCE_STATUS.refused,
            description: req.body.description ?? null,
        });

        return await SentenceService.fullOne(req.params.sentence._id);
    }

    async changeStatus(req: BodyParamsReqType<IChangeSentenceStatusRequest, { sentence: ISentence }>) {
        await SentenceService.update(req.params.sentence._id, {
            user: req.body.status === SENTENCE_STATUS.unchanged ? null : req.user._id,
            status: req.body.status,
        });

        return await SentenceService.fullOne(req.params.sentence._id);
    }

    async show(req: ParamsReqType<{ sentence: IFullSentence }>) {
        return req.params.sentence;
    }

    async store(req: BodyReqType<ISentenceStoreRequest>) {
        return await SentenceService.make({
            words: req.body.words.join(' '),
            status: SENTENCE_STATUS.unchanged
        });
    }

    async update(req: BodyParamsReqType<ISentenceStoreRequest, { sentence: ISentence }>) {
        await SentenceService.incRelationsCount(req.params.sentence._id, -1);

        await SentenceService.update(req.params.sentence._id, {
            words: req.body.words.join(' '),
            status: SENTENCE_STATUS.unchanged,
            entities: [],
            relations: [],
            user: req.user._id,
        });
        return await SentenceService.fullOne(req.params.sentence._id);
    }

    async destroy(req: ParamsReqType<{ sentence: ISentence }>) {
        await SentenceService.incRelationsCount(req.params.sentence._id, -1);

        await SentenceService.destroy(req.params.sentence._id);
        return {};
    }

}