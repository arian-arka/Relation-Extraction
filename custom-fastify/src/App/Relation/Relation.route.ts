import Route from "../../Core/Class/Route";
import {AuthenticatedUserMiddleware} from "../User/User.middleware";
import {RelationListRequest, RelationStoreRequest, RelationUpdateRequest} from "./Relation.request";
import {RelationListResponse, RelationResponse} from "./Relation.response";
import {MRelation} from "./Relation.model";

export default Route.open(async (route: Route) => {

    route.prefix('/api/relation').group(async (route: Route) => {
        route.middleware(AuthenticatedUserMiddleware).group(async (route: Route) => {
            route.get('/list','Relation/Relation@list')
                .can('User/User@CUser','view relations')
                .request(RelationListRequest)
                .response(RelationListResponse);

            route.get('/:relation','Relation/Relation@show')
                .can('User/User@CUser','view relation')
                .inject('relation', MRelation)
                .response(RelationResponse);

            route.post('/', 'Relation/Relation@store')
                .can('User/User@CUser','store relation')
                .request(RelationStoreRequest)
                .response(RelationResponse);

            route.put('/:relation', 'Relation/Relation@update')
                .inject('relation', MRelation)
                .can('User/User@CUser','update relation')
                .request(RelationUpdateRequest)
                .response(RelationResponse);

            route.delete('/:relation', 'Relation/Relation@destroy')
                .inject('relation', MRelation)
                .can('User/User@CUser','destroy relation');

        });
    });

});