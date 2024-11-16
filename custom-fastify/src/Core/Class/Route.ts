import {FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest} from "fastify";
import {ActionType, FastifyRouteObjectType, MiddlewareType, RequestHandlerType, RouteObjectType} from "../CoreTypes";
import Middleware from "./Middleware";
import Controller from "../Singleton/Controller";
import Loader from "../Singleton/Loader";
import Path from "../Singleton/Path";
import {Request} from "./Request";
import {Response} from "./Response";
import {globalMiddlewares} from "../../Plugins/providers";
import {Model} from "mongoose";
import Str from "../Singleton/Str";
import {NotFound} from "./Respond";
import {Can} from "./Can";

class GroupOfRoutes {
    constructor(private readonly _fastify: FastifyInstance) {
    }

    private _prefix: string = '';

    private _middlewares: RequestHandlerType[] = [];

    middleware(middlewares: MiddlewareType[] | MiddlewareType): GroupOfRoutes {
        if (Array.isArray(middlewares)) {
            for (let middleware of middlewares) {
                if (middleware instanceof Middleware)
                    this._middlewares.push(middleware.handle);

                else if (middleware.prototype instanceof Middleware)
                    this._middlewares.push(middleware.make());

                else
                    this._middlewares.push(middleware);
            }
        } else {
            if (middlewares instanceof Middleware)
                this._middlewares.push(middlewares.handle);
            else if (middlewares.prototype instanceof Middleware)
                this._middlewares.push(middlewares.make());
            else
                this._middlewares.push(middlewares);
        }
        return this;
    }

    prefix(prefix: string): GroupOfRoutes {
        this._prefix = prefix;
        return this;
    }

    group(routes: (route: Route) => void): void {
        const isAsync = routes.constructor.name === 'AsyncFunction';
        const outSide = this;
        if (isAsync) {
            this._fastify.register(async function (app, _) {
                const r = new Route(app);
                r.addMiddleware([...outSide._middlewares]);
                await routes(r);
                await r.make();
            }, (this._prefix.length > 0) ? {'prefix': this._prefix} : {})
        } else {
            this._fastify.register(function (app, _, done) {
                const r = new Route(app);
                r.addMiddleware([...outSide._middlewares]);
                routes(r);
                r.make().then(() => done());
            }, (this._prefix.length > 0) ? {'prefix': this._prefix} : {})
        }
    }

}

class SingleRoute {
    public _request?: Request | Function;

    public _response?: Response | Function;

    public can(path: string,...args:any) {
        this.middleware(
            async (request : FastifyRequest,reply : FastifyReply)=>{
                const f = Can.find(path);
                await f(request,reply,...args);
            }
        );
        return this;
    }

    public inject(param: string, model: Model<any> | ((param : string) => any), throwOnNull: boolean = true) {
        this.middleware(async (req: FastifyRequest) => {
            // @ts-ignore
            const _id: string = req?.params[param] ?? '';
            const obj = Str.isValidObjectId(_id) ?
                ('findOne' in model ? await model.findOne({_id}).exec() : await model(_id)) :
                null;
            if (throwOnNull && !obj)
                throw new NotFound;
            // @ts-ignore
            req.params[param] = obj;
        })
        return this;
    }

    request(request: Request | Function) {
        this._request = request;
        return this;
    }

    response(_response: Response | Function) {
        this._response = _response;
        return this;
    }

    constructor(private readonly props: RouteObjectType) {
        if (!this.props.middlewares)
            this.props.middlewares = [];
    }

    prependMiddleware(middlewares: MiddlewareType[] | MiddlewareType): SingleRoute {
        if (!this.props?.middlewares)
            this.props.middlewares = [];
        if (Array.isArray(middlewares)) {
            for (let middleware of middlewares) {
                if (middleware instanceof Middleware)
                    this.props.middlewares = [middleware.handle, ...this.props.middlewares];

                else if (middleware.prototype instanceof Middleware)
                    this.props.middlewares = [middleware.make(), ...this.props.middlewares];

                else
                    this.props.middlewares = [middleware, ...this.props.middlewares];
            }
        } else {
            if (middlewares instanceof Middleware)
                this.props.middlewares = [middlewares.handle, ...this.props.middlewares];
            else if (middlewares.prototype instanceof Middleware)
                this.props.middlewares = [middlewares.make(), ...this.props.middlewares];
            else
                this.props.middlewares = [middlewares, ...this.props.middlewares];
        }
        return this;
    }

    middleware(middlewares: MiddlewareType[] | MiddlewareType): SingleRoute {
        if (!this.props?.middlewares)
            this.props.middlewares = [];
        if (Array.isArray(middlewares)) {
            for (let middleware of middlewares) {
                if (middleware instanceof Middleware)
                    this.props.middlewares.push(middleware.handle);

                else if (middleware.prototype instanceof Middleware)
                    this.props.middlewares.push(middleware.make());

                else
                    this.props.middlewares.push(middleware);
            }
        } else {
            if (middlewares instanceof Middleware)
                this.props.middlewares.push(middlewares.handle);
            else if (middlewares.prototype instanceof Middleware)
                this.props.middlewares.push(middlewares.make());
            else
                this.props.middlewares.push(middlewares);
        }
        return this;
    }

    toObject(): FastifyRouteObjectType {
        const preHandler = this.props?.middlewares ?? [];
        if (this._request) { // @ts-ignore
            preHandler.push(this._request instanceof Request ? this._request : this._request.asMiddleware());
        }

        // @ts-ignore
        const response = this._response ? (this._response instanceof Response ? this._response : new this._response) : undefined;

        return {
            url: this.props.url,
            handler: this.props.handler,
            preHandler: this.props?.middlewares ?? [],
            method: this.props?.method ?? 'GET',
            schema: response ? {
                response: {200: response.schema()}
            } : undefined,
        };
    }
}

export default class Route {
    private _middlewares: RequestHandlerType[] = [];

    addMiddleware(middlewares: MiddlewareType[] | MiddlewareType): Route {
        if (Array.isArray(middlewares)) {
            for (let middleware of middlewares) {
                if (middleware instanceof Middleware)
                    this._middlewares.push(middleware.handle);

                else if (middleware.prototype instanceof Middleware)
                    this._middlewares.push(middleware.make());

                else
                    this._middlewares.push(middleware);
            }
        } else {
            if (middlewares instanceof Middleware)
                this._middlewares.push(middlewares.handle);
            else if (middlewares.prototype instanceof Middleware)
                this._middlewares.push(middlewares.make());
            else
                this._middlewares.push(middlewares);
        }
        return this;
    }

    private _singleRoutes: SingleRoute[] = [];

    constructor(private readonly _fastify: FastifyInstance) {
    }

    middleware(middlewares: MiddlewareType[] | MiddlewareType): GroupOfRoutes {
        return new GroupOfRoutes(this._fastify).middleware(middlewares).middleware(this._middlewares);
    }

    prefix(prefix: string): GroupOfRoutes {
        return new GroupOfRoutes(this._fastify).prefix(prefix).middleware(this._middlewares);
    }

    private getHandler(handler: ActionType): RequestHandlerType {
        if (typeof handler === 'string') {
            const h = handler.split('@');
            return Controller.methodOf(h[0], h[1]);
        }
        return handler;
    }

    get(url: string, handler: ActionType): SingleRoute {
        const r = new SingleRoute({
            url,
            method: 'GET',
            handler: this.getHandler(handler),
        });
        this._singleRoutes.push(r);
        return r;
    }

    post(url: string, handler: ActionType): SingleRoute {
        const r = new SingleRoute({
            url,
            method: 'POST',
            handler: this.getHandler(handler),
        });
        this._singleRoutes.push(r);
        return r;
    }

    put(url: string, handler: ActionType): SingleRoute {
        const r = new SingleRoute({
            url,
            method: 'PUT',
            handler: this.getHandler(handler),
        });
        this._singleRoutes.push(r);
        return r;
    }

    delete(url: string, handler: ActionType): SingleRoute {
        const r = new SingleRoute({
            url,
            method: 'DELETE',
            handler: this.getHandler(handler),
        });
        this._singleRoutes.push(r);
        return r;
    }

    static open(routes: (route: Route) => void) {
        const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
            const r = new Route(fastify).addMiddleware(globalMiddlewares);
            await routes(r);
            await r.make();
        }
        return root;
    }

    async make() {
        let obj;
        for (let r of this._singleRoutes) {
            r.prependMiddleware([...this._middlewares]);
            obj = r.toObject();
            //console.log('fullUrl', `${this._fastify.prefix}${obj.url}`);
            //console.log('route', obj);
            //console.log('---------------');
            // @ts-ignore
            this._fastify.route(obj);
        }
    }
}

export async function generateRoutes(fastify: FastifyInstance) {
    Loader.js(Path.app(), async (name: string, ext: string, newDir: string) => {
        await fastify.register(require(newDir));
    }, 'route')
}