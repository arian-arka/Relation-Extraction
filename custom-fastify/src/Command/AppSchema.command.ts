import Command from "../Core/Class/Command";
import File from "../Core/Singleton/File";
import Path from "../Core/Singleton/Path";
import Str from "../Core/Singleton/Str";

export default class AppSchemaCommand extends Command<any, any> {
    protected command = 'app:schema';

    protected makeDir(name: string) {
        return File.mkdirSync(Path.base('src/App', name));
    }

    protected makeInterface(name: string) {
        const data = `
import {Types} from "mongoose";

export interface I${name} {
    _id: Types.ObjectId,

    updatedAt: Date,

    createdAt: Date,
}
        `;
        File.writeSync(Path.base('src/App', name, name + '.interface.ts'), data);
    }

    protected makeModel(name: string) {
        const data = `

import {model, Schema} from "mongoose";
import {I${name}} from "./${name}.interface";

export const S${name} = new Schema<I${name}>({
    
},{
    timestamps:{
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
    }
})

S${name}.index({name: 'text'});

export const M${name} = model<I${name}>('${name}',S${name});
        `;

        File.writeSync(Path.base('src/App', name, name + '.model.ts'), data);
    }

    protected makeService(name: string) {
        const data = `
import MongooseService from "../../Core/Class/MongooseService";
import {I${name}} from "./${name}.interface";
import {M${name}} from "./${name}.model";
import {I${name}ListRequest} from "./${name}.request";

class ${name}Service extends MongooseService<I${name}> {
    constructor() {
        super(M${name});
    }

    async list(queryParams: I${name}ListRequest) {
        const query: any = {};
        
        return this.paginate({
            query,
            linkPerPage: queryParams.linkPerPage,
            limit: queryParams.limit,
            page: queryParams.page,
        })
    }
}

export default new ${name}Service();

        `;

        File.writeSync(Path.base('src/App', name, name + '.service.ts'), data);
    }

    protected makeRequest(name: string) {
        const data = `
import {JSONSchemaType} from "ajv";
import {BodyParamsReq, BodyReq, QueryReq} from "../../Core/Class/Request";
import {I${name}} from "./${name}.interface";
import {IMongoosePagination, MongoosePaginator} from "../../Core/Class/MongooseService";

export interface I${name}StoreRequest {
    
}

export class ${name}StoreRequest extends BodyReq<I${name}StoreRequest> {
    protected body(): JSONSchemaType<I${name}StoreRequest> | undefined {
        return {
            type: 'object',
            properties: {
                
            },
            additionalProperties: false,
            required: []
        };
    }
}

export interface I${name}UpdateRequest {
    
}

export class ${name}UpdateRequest extends BodyParamsReq<I${name}UpdateRequest,{${Str.lowerFirstChar(name)} : I${name}}> {
    protected body(): JSONSchemaType<I${name}UpdateRequest> | undefined {
        return {
            type: 'object',
            properties: {
        
            },
            additionalProperties: false,
            required: []
        };
    }

}

export interface I${name}ListRequest extends IMongoosePagination {
    
}

export class ${name}ListRequest extends QueryReq<I${name}ListRequest> {
    protected query(): JSONSchemaType<I${name}ListRequest> | undefined {
        return {
            type: "object",
            properties: {
                ...MongoosePaginator.properties(),
                
            },

            required: [...MongoosePaginator.required()]
        }
    }
}

        `;

        File.writeSync(Path.base('src/App', name, name + '.request.ts'), data);
    }

    protected makeResponse(name: string) {
        const data = `
import {JSONSchemaType} from "ajv";
import {Response} from "../../Core/Class/Response";
import {IPaginated, MongoosePaginator} from "../../Core/Class/MongooseService";
import {I${name}} from "./${name}.interface";

export interface I${name}Response extends Omit<I${name}, '_id' | 'createdAt' | 'updatedAt'> {
    _id: string,
    updatedAt: string,
    createdAt: string,
}

export class ${name}Response extends Response<I${name}Response> {
    schema(): JSONSchemaType<I${name}Response> {
        return {
            type: 'object',
            properties: {
                _id: {type: 'string'},
              
                updatedAt: {type: 'string'},
                createdAt: {type: 'string'},
            },
            additionalProperties: false,
            required: ['_id', 'updatedAt', 'createdAt']
        };
    }
}

export interface I${name}ListResponse  extends I${name}Response {}

export class ${name}ListResponse extends Response<IPaginated<I${name}ListResponse>> {
    schema(): JSONSchemaType<IPaginated<I${name}ListResponse>> {
        return {
            type: 'object',
            properties: {
                ...MongoosePaginator.paginationProperties(),
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: {type: 'string'},
                       
                            updatedAt: {type: 'string'},
                            createdAt: {type: 'string'},
                        },
                        required: ['_id', 'updatedAt', 'createdAt'],
                        additionalProperties: false,
                    }
                },
            },
            additionalProperties: false,
            ...MongoosePaginator.paginationRequired()
        }
    }
}

        `;

        File.writeSync(Path.base('src/App', name, name + '.response.ts'), data);
    }

    protected makeRoute(name: string) {
        const data = `
import Route from "../../Core/Class/Route";
import {AuthenticatedUserMiddleware} from "../User/User.middleware";
import {${name}ListRequest, ${name}StoreRequest, ${name}UpdateRequest} from "./${name}.request";
import {${name}ListResponse, ${name}Response} from "./${name}.response";
import {M${name}} from "./${name}.model";

export default Route.open(async (route: Route) => {

    route.prefix('/api/${Str.lowerFirstChar(name)}').group(async (route: Route) => {
        route.middleware(AuthenticatedUserMiddleware).group(async (route: Route) => {
            route.get('/list','${name}/${name}@list')
                .can('User/User@CUser','view ${Str.lowerFirstChar(name)}s')
                .request(${name}ListRequest)
                .response(${name}ListResponse);

            route.get('/:${Str.lowerFirstChar(name)}','${name}/${name}@show')
                .can('User/User@CUser','view ${Str.lowerFirstChar(name)}')
                .inject('${Str.lowerFirstChar(name)}', M${name})
                .response(${name}Response);

            route.post('/', '${name}/${name}@store')
                .can('User/User@CUser','store ${Str.lowerFirstChar(name)}')
                .request(${name}StoreRequest);

            route.put('/:${Str.lowerFirstChar(name)}', '${name}/${name}@update')
                .inject('${Str.lowerFirstChar(name)}', M${name})
                .can('User/User@CUser','update ${Str.lowerFirstChar(name)}')
                .request(${name}UpdateRequest)
                .response(${name}Response);

            route.delete('/:${Str.lowerFirstChar(name)}', '${name}/${name}@destroy')
                .inject('${Str.lowerFirstChar(name)}', M${name})
                .can('User/User@CUser','destroy ${Str.lowerFirstChar(name)}');

        });
    });

});

        `;

        File.writeSync(Path.base('src/App', name, name + '.route.ts'), data);
    }

    protected makeController(name: string) {
        const data = `
import Controller from "../../Core/Class/Controller";
import {BodyParamsReqType, BodyReqType, ParamsReqType, QueryReqType} from "../../Core/CoreTypes";
import {I${name}} from "./${name}.interface";
import {I${name}ListRequest, I${name}StoreRequest} from "./${name}.request";
import ${name}Service from "./${name}.service";

export default class ${name}Controller extends Controller {
    async show(req: ParamsReqType<{ ${Str.lowerFirstChar(name)}: I${name} }>) {
        return req.params.${Str.lowerFirstChar(name)};
    }

    async store(req: BodyReqType<I${name}StoreRequest>) {
        return await ${name}Service.make(req.body);
    }

    async update(req: BodyParamsReqType<I${name}StoreRequest, { ${Str.lowerFirstChar(name)}: I${name} }>) {
        await ${name}Service.update(req.params.${Str.lowerFirstChar(name)}._id, req.body);
        return await ${name}Service.one(req.params.${Str.lowerFirstChar(name)}._id);
    }

    async destroy(req: ParamsReqType<{ ${Str.lowerFirstChar(name)}: I${name} }>) {
        await ${name}Service.destroy(req.params.${Str.lowerFirstChar(name)}._id);
        return {};
    }

    async list(req: QueryReqType<I${name}ListRequest>) {
        return await ${name}Service.list(req.query);
    }
}

        `;

        File.writeSync(Path.base('src/App', name, name + '.controller.ts'), data);
    }

    async handle(args: [string]): Promise<void> {
        console.log(args);
        const [name] = args;

        if (!this.makeDir(name)) {
            console.log('Already exists!.');
            return;
        }
        this.makeInterface(name);
        this.makeModel(name);
        this.makeRequest(name);
        this.makeResponse(name);
        this.makeService(name);
        this.makeController(name);
        this.makeRoute(name);
    }
}