import ResponseStatus from "../../App/ResponseStatus";

export interface ResponseInterface<dataSchema> {
    headers?: Headers,
    status: number,
    ok: boolean,
    data: dataSchema,
    isReal: boolean,
}

export const RESPONSE_STATUS = {
    'ok': 200,
    'created': 201,
    'accepted': 202,
    'no content': 204,

    'bad request': 400,
    'bad': 400,
    'unauthorized': 401,
    'forbidden': 403,
    'not found': 404,
    'too many requests': 429,

    'csrf': 419,

    'internal': 500,
    'internal server': 500,
    'internal server error': 500,
    'service unavailable': 503,
} as const;


export default class Response<dataSchema> {
    public props: ResponseInterface<dataSchema>;

    constructor(props: ResponseInterface<dataSchema>) {
        this.props = props;

        const strStatus = `${this.props.status}`;
        if (strStatus in ResponseStatus) { // @ts-ignore
            Object.values(ResponseStatus[strStatus]).map((callback) => callback(this));
        } else { // @ts-ignore
            Object.values(ResponseStatus["default"]).map((callback) => callback(this));
        }
    }

    isSuccess(): boolean {
        return this.props.status % 100 === 2;
    }

    isBad(): boolean {
        return this.props.status % 100 === 4;
    }

    isInternal(): boolean {
        return this.props.status % 100 === 5;
    }

    is(status: string | number): boolean {
        const s = parseInt(`${status}`);
        if (!Number.isNaN(s))
            return this.props.status === s;

        // @ts-ignore
        switch (status.toLowerCase()) {
            case 'bad':
                return this.isBad();
            case  'success':
                return this.isSuccess();
            case  'internal':
                return this.isInternal();
        }
        // @ts-ignore
        return status in RESPONSE_STATUS && this.props.status === RESPONSE_STATUS[status];
    }

    extend(extensions: { [key: string]: any }) {
        for (let key in extensions)
            Object.defineProperty(this, key, {
                writable: false,
                value: extensions[key],
            });

        return this;
    }

    on(status: string | number, callback: (response: Response<dataSchema>) => void): undefined | Response<dataSchema> {
        if (this.is(status)){
            callback(this);
            return undefined;
        }
        return this;
    }
}