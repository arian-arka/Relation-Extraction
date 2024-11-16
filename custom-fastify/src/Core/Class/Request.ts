import Ajv, {DefinedError, JSONSchemaType, ValidateFunction} from "ajv";
import {
    BadRequestMessageType,
    RequestSchemaType,
    RequestSchemaOptionType,
    ValidateOptionType,
    ReqType, RequestHandlerType,
} from "../CoreTypes"
import ajvErrors from "ajv-errors";
import {FastifyReply, FastifyRequest} from "fastify";
import addFormats from "ajv-formats";
import Lang from "../Singleton/Lang";

export class ValidationError {

    private _data: BadRequestMessageType = {};

    private _hasError: boolean = false;

    public set(key: string, value: string) {
        this._data[key] = value;
        this._hasError = true;
        return this;
    }

    public lang(key: string, langKey: string, ...args: any[]) {
        return this.set(key, Lang.generate(langKey, ...args));
    }

    public merge(messages: BadRequestMessageType | undefined) {
        if (messages) {
            for (let key in messages)
                this.set(key, messages[key]);
        }
        return this;
    }

    public hasError(): boolean {
        return this._hasError;
    }

    public assignAjvRouteValue(errors: DefinedError[]) {
        for (let error of errors) {
            if (typeof error.params === 'object' && ('missingProperty' in error.params))
                this.set(
                    `${error.instancePath}/${error.params.missingProperty}`.replace(/^\/|\/$/g, '')
                        .replaceAll('/', '.'), error.message ?? 'error'
                );
            else {
                const indexOf = error.message?.indexOf('|') ?? -1;
                if (indexOf === -1)
                    this.set(error.instancePath.replace(/^\/|\/$/g, '')
                        .replaceAll('/', '.'), error.message ?? 'error'
                    );
                else
                    this.set(error.message?.substring(0, indexOf) ?? '', (error.message?.substring(indexOf + 1) ?? '') ?? 'error');
            }
        }
        return this;
    }

    public messages() {
        return this._data;
    }
}

export class RequestSchema<BodyType = any, QueryType = any, ParamsType = any, HeadersType = any> {
    private _schema: RequestSchemaType<BodyType, QueryType, ParamsType, HeadersType>;

    private _bodyCompiler: ValidateFunction<BodyType> | undefined = undefined;

    private _queryCompiler: ValidateFunction<QueryType> | undefined = undefined;

    private _paramsCompiler: ValidateFunction<ParamsType> | undefined = undefined;

    private _headersCompiler: ValidateFunction<HeadersType> | undefined = undefined;

    constructor(schema: RequestSchemaType<BodyType, QueryType, ParamsType, HeadersType>, options: RequestSchemaOptionType = {
        body: {
            removeAdditional: true,
            allErrors: true,
        },
        headers: {
            removeAdditional: true,
            allErrors: true,
        },
        params: {
            removeAdditional: true,
            allErrors: true,
        },
        query: {
            removeAdditional: true,
            allErrors: true,
        },
    }) {


        this._schema = schema;
        let tmp;
        if (this._schema) {
            if (this._schema.body) {
                tmp = (new Ajv(options.body));
                addFormats(tmp);
                ajvErrors(tmp);
                this._bodyCompiler = tmp.compile(this._schema.body);
            }
            if (this._schema.query) {
                tmp = (new Ajv(options.query));
                addFormats(tmp);
                ajvErrors(tmp);
                this._queryCompiler = tmp.compile(this._schema.query);
            }
            if (this._schema.params) {
                tmp = (new Ajv(options.body));
                addFormats(tmp);
                ajvErrors(tmp);
                this._paramsCompiler = tmp.compile(this._schema.params);
            }
            if (this._schema.headers) {
                tmp = (new Ajv(options.headers));
                addFormats(tmp);
                ajvErrors(tmp);
                this._headersCompiler = tmp.compile(this._schema.headers);
            }
        }
    }

    static of<BodyType = any, QueryType = any, ParamsType = any, HeadersType = any>(schema: RequestSchemaType<BodyType, QueryType, ParamsType, HeadersType>, options: RequestSchemaOptionType = {
        body: {
            removeAdditional: true,
            allErrors: true,
        },
        headers: {
            removeAdditional: true,
            allErrors: true,
        },
        params: {
            removeAdditional: true,
            allErrors: true,
        },
        query: {
            removeAdditional: true,
            allErrors: true,
        },
    }): RequestSchema<BodyType, QueryType, ParamsType, HeadersType> {
        return new RequestSchema<BodyType, QueryType, ParamsType, HeadersType>(schema, options);
    }

    async validate(
        request: ReqType<BodyType, QueryType, ParamsType, HeadersType>,
        options: ValidateOptionType = {
            breakOnFirstOrder: true,
            throw: true,
            order: [
                'params', 'query', 'body', 'headers', 'custom'
            ]
        }
    ): Promise<void | ValidationError | never> {
        const vErrors = new ValidationError();

        let hasError = false;

        for (let o of options.order) {
            switch (o) {
                case 'body':
                    if (this._bodyCompiler && !this._bodyCompiler(request?.body)) {
                        hasError = true;
                        vErrors.assignAjvRouteValue(this._bodyCompiler.errors as DefinedError[]);
                    }
                    break;
                case 'headers':
                    if (this._headersCompiler && !this._headersCompiler(request?.headers)) {
                        hasError = true;
                        vErrors.assignAjvRouteValue(this._headersCompiler.errors as DefinedError[]);
                    }
                    break;
                case 'params':
                    if (this._paramsCompiler && !this._paramsCompiler(request?.params)) {
                        hasError = true;
                        vErrors.assignAjvRouteValue(this._paramsCompiler.errors as DefinedError[]);
                    }
                    break;
                case 'query':
                    if (this._queryCompiler && !this._queryCompiler(request?.query)) {
                        hasError = true;
                        vErrors.assignAjvRouteValue(this._queryCompiler.errors as DefinedError[]);
                    }
                    break;
                case 'custom':
                    if (this._schema?.custom) {
                        await this._schema.custom(request, vErrors);
                        if (vErrors.hasError())
                            hasError = true;
                    }
            }

            if (hasError && options.breakOnFirstOrder)
                break;
        }

        if (hasError) {
            if (options?.throw === true)
                throw vErrors;

            return vErrors;
        }
        return undefined;
    }

}

export class Request<BodyType = any, QueryType = any, ParamsType = any, HeadersType = any> {


    protected options(): RequestSchemaOptionType {
        return {
            body: {
                removeAdditional: true,
                allErrors: true,
            },
            headers: {
                removeAdditional: true,
                allErrors: true,
            },
            params: {
                removeAdditional: true,
                allErrors: true,
            },
            query: {
                coerceTypes : true,
                removeAdditional: true,
                allErrors: true,
            },
        };
    }

    protected body(): JSONSchemaType<BodyType> | undefined {
        return undefined;
    }

    protected query(): JSONSchemaType<QueryType> | undefined {
        return undefined;
    }

    protected params(): JSONSchemaType<ParamsType> | undefined {
        return undefined;
    }

    protected headers(): JSONSchemaType<HeadersType> | undefined {
        return undefined;
    }

    protected async custom(request: ReqType<BodyType, QueryType, ParamsType, HeadersType>, v: ValidationError): Promise<any> {

    }

    protected async decorateOnSuccess() : Promise<any>{
        return undefined;
    }

    private _requestSchema: RequestSchema<BodyType, QueryType, ParamsType, HeadersType>;

    constructor() {
        this._requestSchema = RequestSchema.of<BodyType, QueryType, ParamsType, HeadersType>({
            body: this.body(),
            query: this.query(),
            params: this.params(),
            headers: this.headers(),
            custom: this.custom
        }, this.options());
    }

    public request: ReqType<BodyType, QueryType, ParamsType, HeadersType> | null = null;

    public async validate(
        request: ReqType<BodyType, QueryType, ParamsType, HeadersType>,
        options: ValidateOptionType = {
            breakOnFirstOrder: true,
            throw: true,
            order: [
                'params', 'query', 'body', 'headers', 'custom'
            ]
        }
    ): Promise<void | ValidationError | never> {
        this.request = request;
        return await this._requestSchema.validate(request, options);
    }


    static asMiddleware(): RequestHandlerType {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            // @ts-ignore
            await (new this).validate(request);
        }
    }
}

export class BodyReq<BodyType = any> extends Request<BodyType> {
}

export class BodyParamsReq<BodyType = any, ParamsType = any> extends Request<BodyType,any, ParamsType> {
}

export class QueryReq<QueryType = any> extends Request<any, QueryType> {
}

export class QueryParamsReq<QueryType = any, ParamsType = any> extends Request<any, QueryType, ParamsType> {
}

export class ParamsReq<ParamsType = any> extends Request<any, any, ParamsType> {
}

export class HeadersReq<HeaderType = any> extends Request<any, any, any, HeaderType> {
}