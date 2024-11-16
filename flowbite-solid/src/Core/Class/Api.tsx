import Urls from "../../App/Urls";
import Url from "../Helper/Url";
import Fetch from "./Fetch";
import Response from "./Response";
import {ObjectSchema, Schema} from "yup";
import Validator, {Validation, validatorType} from "../Helper/Validator";

export default class Api {
    private _baseUrl: string = '';

    constructor(base?: string) {
        this.setBase(base);
    }

    protected setBase(base?: string): Api {
        this._baseUrl = !!base ? Url.backBase(base) : Url.backBase();
        return this;
    }

    private generateUrl(props: {
        url: string,
        queryParameters?: { [key: string]: string },
        base?: string
    }): URL {
        const _ = new URL(props.url, !!props?.base ? props.base : this._baseUrl);
        if (props.queryParameters)
            for (let key in props.queryParameters)
                _.searchParams.set(key, props.queryParameters[key]);
        return _;
    }

    private generateUrlStr(props: {
        url: string,
        queryParameters?: { [key: string]: string },
        base?: string
    }): string {
        return this.generateUrl(props).toString();
    }

    private async _preFetch(props: any) {
        const _ = this.preFetch(props);
        if (!_)
            return null;

        try {
            const response = await _.fetch.json();
            console.log('_prefectch', response);


            return {
                'body': _.body?.(response),
                'headers': _.headers?.(response),
            }
        } catch (e) {
            console.log('_prefetch e', e);
            throw e;
        }


    }

    protected preFetch(props: any): {
        'fetch': Fetch,
        'body'?: (response: Response<any>) => { [key: string]: any },
        'headers'?: (response: Response<any>) => { [key: string]: any },
    } | void {
    }

    public async fetch<T = any, dataType = any>(props: {
        url: string,
        base?: string,
        asFormData?: true | false,
        credentials?: RequestCredentials,
        headers?: { [key: string]: string },
        body?: any | dataType,
        mode?: RequestMode,
        cache?: RequestCache,
        method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | 'OPTIONS',
        validation?: {
            schema?: ObjectSchema<any>,
            custom?: (data: any) => void | { [key: string]: string },
            cast?: true | false | ((validation: Validation) => any)
        } | {
            validator: validatorType<dataType>,
            cast?: true | false | ((validation: Validation) => any)
        },
        preFetch?: boolean

    }): Promise<Response<T>> {
        let validator;
        if (props?.validation) {
            if ('validator' in props?.validation)
                validator = await props.validation.validator(props.body)
            else
                validator = await Validator.make({
                    schema: props?.validation?.schema,
                    custom: props?.validation?.custom,
                    data: props?.body,
                });
            if (validator.hasError())
                throw (new Response<any>({
                    status: -2,
                    data: validator,
                    ok: false,
                    isReal: false,
                }))
        }
        try {
            const preFetched = props?.preFetch === undefined || props.preFetch === true ? await this._preFetch(props) : {
                body: undefined,
                headers: undefined
            };
            let body = undefined;
            if (validator)
                body = validator.data(props?.validation?.cast ? (typeof props?.validation?.cast === 'boolean' ? props?.validation?.cast : props?.validation?.cast(validator)) : true)
            else if (props?.body || preFetched?.body)
                body = {
                    ...(props?.body ?? {}),
                }

            if (preFetched?.body && body)
                body = {
                    ...body,
                    ...(preFetched?.body ?? {}),
                }

            let f;

            if (!props?.method || props.method === 'GET' || props.method === 'HEAD') {
                f = Fetch.url(this.generateUrlStr({
                    url: props.url,
                    queryParameters: body,
                    base: props?.base,
                })).method(props?.method ?? 'GET')
            } else {
                let fData = undefined;
                if (body) {
                    if (props.asFormData) {
                        fData = new FormData();
                        for (let key in body)
                            fData.append(key, body[key]);
                    } else fData = JSON.stringify(body);
                }
                f = Fetch.url(this.generateUrlStr(({
                    url: props.url,
                    base: props?.base,
                })))
                    .method(props.method)
                    .body(fData);
            }
            if (!!props?.mode)
                f.mode(props.mode);
            f.credentials(props?.credentials ?? 'include');
            if (props.headers || preFetched?.headers)
                f.headers({
                    ...(!props?.asFormData ? {'Content-Type': 'application/json'} : {}),
                    ...(props?.headers ?? {}),
                    ...(preFetched?.headers ?? {}),
                });
            else
                f.headers({
                    ...(!props?.asFormData ? {'Content-Type': 'application/json'} : {}),
                })
            if (props.cache)
                f.cache(props.cache);

            return await f.json<T>();

        } catch (e) {
            console.log('###############', e);
            throw  e as Response<any>;
            // return e as Response<any>;
        }
    }

    public async always<T = any, dataType = any>(props: {
        url: string,
        base?: string,
        asFormData?: true | false,
        credentials?: RequestCredentials,
        headers?: { [key: string]: string },
        body?: any | dataType
        cache?: RequestCache,
        method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | 'OPTIONS',
        maxTry?: number,
        timeout?: number, // sec
        condition?: (...args: any[]) => any,
        validation?: {
            schema?: ObjectSchema<any>,
            custom?: (data: any) => void | { [key: string]: string },
            cast?: true | false | ((validation: Validation) => any)
        } | {
            validator: validatorType<dataType>,
            cast?: true | false | ((validation: Validation) => any)
        },
        preFetch?: boolean
    }): Promise<Response<T>> {
        const maxTry = props?.maxTry ?? 1000;
        const timeout = props?.timeout ?? 5;
        let i = 0;
        let response;
        while (i < maxTry && (!props?.condition || props.condition())) {
            try {
                response = await this.fetch<T>(props);
                break;
            } catch (e) {
                if ((e as Response<any>).props.isReal)
                    return e as Response<any>;
            }
            await new Promise(r => setTimeout(r, timeout * 1000));
            i++;
        }
        // @ts-ignore
        return response;
    }

}

