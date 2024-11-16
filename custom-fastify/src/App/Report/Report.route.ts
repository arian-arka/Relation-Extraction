import Route from "../../Core/Class/Route";
import {AuthenticatedUserMiddleware} from "../User/User.middleware";
import {EntitiesCountResponse} from "./Report.response";

export default Route.open(async (route: Route) => {

    route.prefix('/api/report').group(async (route: Route) => {
        route.middleware(AuthenticatedUserMiddleware).group(async (route: Route) => {
            route.get('/entitiesCount', 'Report/Report@entitiesCount')
                .response(EntitiesCountResponse);

        });
    });

});