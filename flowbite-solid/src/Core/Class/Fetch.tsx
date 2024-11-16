import Response from "./Response";

export default class Fetch {
    constructor(url: string) {
        this._url = url;
    }

    private readonly _url: string;

    public static url(value: string): Fetch {
        return new Fetch(value);
    }

    private _body?: BodyInit | null;

    public body(value: BodyInit | null): Fetch {
        this._body = value;
        return this;
    }

    private _method: any;

    public method(value: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH' | 'OPTIONS'): Fetch {
        this._method = value;
        return this;
    }

    private _cache?: any;

    public cache(value: RequestCache): Fetch {
        this._cache = value;
        return this;
    }

    private _mode?: any;

    public mode(value: RequestMode): Fetch {
        this._mode = value;
        return this;
    }

    private _credentials?: any;

    public credentials(value: RequestCredentials): Fetch {
        this._credentials = value;
        return this;
    }

    private _headers?: any;

    public headers(value: { [key: string]: string }): Fetch {
        this._headers = value;
        return this;
    }

    private options(): RequestInit {
        const data: RequestInit = {};
        if (this._body)
            data['body'] = this._body;
        if (this._method)
            data['method'] = this._method;
        if (this._cache)
            data['cache'] = this._cache;
        if (this._credentials)
            data['credentials'] = this._credentials;
        if (this._headers)
            data['headers'] = this._headers;
        if(this._mode)
            data['mode'] = this._mode;
        return data;
    }

    public async text(): Promise<Response<string>> {
        try {
            const f = await fetch(this._url, this.options());
            const data = await f.text();
            const status = f.status;
            const headers = f.headers;
            const r = (new Response<string>({
                status,
                data,
                ok: f.ok,
                isReal: true,
                headers
            }));
            if (Math.floor(status / 100) !== 2)
                throw r;
            return r;

        } catch (e) {
            if(e instanceof Response)
                throw e;
            return (new Response<string>({
                status: -1,
                data: '',
                ok: false,
                isReal: false,
            }))
        }

    }

    public async json<T = any>(): Promise<Response<T>> {
        try {
            const f = await fetch(this._url, {...this.options(),});
            const data = await f.json();
            const status = f.status;
            const headers = f.headers;
            const r = (new Response<T>({
                status,
                data,
                ok: f.ok,
                isReal: true,
                headers
            }));
            if (Math.floor(status / 100) !== 2)
                throw r;
            return r;
        } catch (e) {
            if(e instanceof Response)
                throw e;
            throw (new Response<any>({
                status: -1,
                data: {
                    exception: e
                },
                ok: false,
                isReal: false,
            }))
        }

    }
}