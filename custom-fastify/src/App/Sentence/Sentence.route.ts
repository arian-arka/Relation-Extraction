import Route from "../../Core/Class/Route";
import {AuthenticatedUserMiddleware} from "../User/User.middleware";
import {
    ChangeSentenceStatusRequest,
    PublishSentenceRequest,
    SentenceListRequest,
    SentenceStoreRequest,
    SentenceUpdateRequest,
    TagSentenceRequest
} from "./Sentence.request";
import {SentenceListResponse, SentenceResponse} from "./Sentence.response";
import {MSentence} from "./Sentence.model";
import SentenceService from "./Sentence.service";

export default Route.open(async (route: Route) => {

    route.prefix('/api/sentence').group(async (route: Route) => {
        route.middleware(AuthenticatedUserMiddleware).group(async (route: Route) => {

            route.get('/list', 'Sentence/Sentence@list')
                .can('User/User@CUser', 'view sentences')
                .request(SentenceListRequest)
                .response(SentenceListResponse);

            route.put('/open/:sentence', 'Sentence/Sentence@open')
                .inject('sentence', MSentence)
                .can('User/User@CUser', 'update sentence')
                .can('Sentence/Sentence@COpenSentence')
                .response(SentenceResponse);

            route.put('/tag/:sentence', 'Sentence/Sentence@tag')
                .can('User/User@CUser', 'update sentence')
                .inject('sentence', MSentence)
                .can('Sentence/Sentence@CTagSentence')
                .request(TagSentenceRequest)
                .response(SentenceResponse);

            route.put('/publish/:sentence', 'Sentence/Sentence@publish')
                .inject('sentence', MSentence)
                .can('User/User@CUser', 'publish sentence')
                .request(PublishSentenceRequest)
                .response(SentenceResponse);

            route.put('/status/:sentence', 'Sentence/Sentence@changeStatus')
                .can('User/User@CUser', 'update sentence')
                .inject('sentence', MSentence)
                .can('Sentence/Sentence@CEditSentence')
                .request(ChangeSentenceStatusRequest)
                .response(SentenceResponse);

            route.get('/:sentence', 'Sentence/Sentence@show')
                .can('User/User@CUser', 'view sentence')
                .inject('sentence', async (s: string) => await SentenceService.fullOne(s))
                .response(SentenceResponse);

            route.put('/:sentence', 'Sentence/Sentence@update')
                .inject('sentence', MSentence)
                .can('User/User@CUser', 'update sentence')
                .can('User/User@CUser', 'update sentence words')
                .request(SentenceUpdateRequest)
                .response(SentenceResponse);

            route.delete('/:sentence', 'Sentence/Sentence@destroy')
                .inject('sentence', MSentence)
                .can('User/User@CUser', 'destroy sentence');

            route.post('/', 'Sentence/Sentence@store')
                .can('User/User@CUser', 'store sentence')
                .request(SentenceStoreRequest);

        });
    });

});

        