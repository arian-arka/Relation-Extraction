import Route from "../../Core/Class/Route";
import {
    UserGrantRequest,
    UserListRequest,
    UserLoginRequest,
    UserStoreRequest,
    UserUpdateProfileRequest,
    UserUpdateRequest
} from "./User.request";
import {UserListResponse, UserLoginResponse} from "./User.response";
import {AuthenticatedUserMiddleware, UnAuthenticatedUserMiddleware} from "./User.middleware";
import {MUser} from "./User.model";

export default Route.open(async (route: Route) => {

    route.prefix('/api/user').group(async (route: Route) => {
        route.middleware(UnAuthenticatedUserMiddleware).group(async (route: Route) => {
            route.post('/login', 'User/User@login').request(UserLoginRequest).response(UserLoginResponse);
            // route.post('/register', 'User/User@register').request(UserRegisterRequest);

        });

        route.middleware(AuthenticatedUserMiddleware).group(async (route: Route) => {
            route.get('/list','User/User@list')
                .can('User/User@CUser','view users')
                .request(UserListRequest)
                .response(UserListResponse);

            route.get('/self', 'User/User@self')
                .response(UserLoginResponse);

            route.get('/logout', 'User/User@logout');

            route.put('/profile', 'User/User@updateProfile')
                .request(UserUpdateProfileRequest)
                .response(UserLoginResponse);

            route.put('/grant/:user', 'User/User@grant')
                .inject('user', MUser)
                .can('User/User@CUser','update user')
                .request(UserGrantRequest)
                .response(UserLoginResponse);

            route.get('/:user','User/User@show')
                .can('User/User@CUser','view user')
                .inject('user', MUser)
                .response(UserLoginResponse);

            route.post('/', 'User/User@store')
                .can('User/User@CUser','store user')
                .request(UserStoreRequest)
                .response(UserLoginResponse);

            route.put('/:user', 'User/User@update')
                .inject('user', MUser)
                .can('User/User@CUser','update user')
                .request(UserUpdateRequest)
                .response(UserLoginResponse);

            route.delete('/:user', 'User/User@destroy')
                .inject('user', MUser)
                .can('User/User@CUser','destroy user');

        });
    });

});