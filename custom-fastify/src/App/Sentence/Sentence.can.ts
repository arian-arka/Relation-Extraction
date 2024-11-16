import {Can} from "../../Core/Class/Can";
import {ParamsReqType} from "../../Core/CoreTypes";
import {Forbidden} from "../../Core/Class/Respond";
import {FastifyReply} from "fastify";
import {ISentence} from "./Sentence.interface";
import {SENTENCE_STATUS} from "./Sentence.constant";
import {USER_PRIVILEGES} from "../User/User.constant";
export class CTagSentence extends Can {
    async handle(request: ParamsReqType<{ sentence: ISentence }>, reply: FastifyReply, can: string) {
        const sentence = request.params.sentence;
        const user = request.user;

        if (!sentence.user || !user._id.equals(sentence.user) || sentence.status !== SENTENCE_STATUS.editing)
            throw new Forbidden;

    }
}
export class CEditSentence extends Can {
    async handle(request: ParamsReqType<{ sentence: ISentence }>, reply: FastifyReply, can: string) {
        const sentence = request.params.sentence;
        const user = request.user;

        if (!sentence.user || !user._id.equals(sentence.user))
            throw new Forbidden;

    }
}

export class COpenSentence extends Can{
    async handle(request: ParamsReqType<{ sentence: ISentence }>, reply: FastifyReply, can: string) {
        const sentence = request.params.sentence;
        const user = request.user;

        if (sentence.user && sentence.status === SENTENCE_STATUS.editing && !user._id.equals(sentence.user))
            throw new Forbidden;

    }
}

export class CChangeSentenceStatus extends Can {

    async handle(request: ParamsReqType<{ sentence: ISentence }>, reply: FastifyReply, can: string) {
        const sentence = request.params.sentence;
        const user = request.user;
        if(user.privileges.includes(USER_PRIVILEGES['publish sentence']))
            return;

        if (sentence.user && sentence.status === SENTENCE_STATUS.editing && !user._id.equals(sentence.user))
            throw new Forbidden;

    }
}
