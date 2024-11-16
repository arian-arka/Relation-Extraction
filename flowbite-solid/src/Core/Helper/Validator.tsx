import {ObjectSchema, Schema} from 'yup';

export class Validation {
    private _custom?: (data: any) => void | { [key: string]: string };

    private _schema?: ObjectSchema<any>;

    private _key: string = '';

    private _message: string = '';

    private _messages: { [key: string]: string } = {}

    private _data:any;

    constructor(schema?: ObjectSchema<any>, custom?: (data: any) => void | { [key: string]: string }) {
        this._custom = custom;
        this._schema = schema;
    }

    private async runCustom(data : any){
        if(this._custom){
            const _ = await this._custom(data);
            if(_){
                for(let key in _){
                    this._key = key;
                    this._message = _[key];
                    this._messages = {[this._key]: this._message};
                    break;
                }
            }
        }
    }

    async run(data: any): Promise<Validation> {
        this._key = '';
        this._message = '';
        this._messages = {};
        this._data = null;

        if (!this._schema)
            return this;
        try {
            const d = await this._schema.validate(data);
            this._data = data;
            await this.runCustom(data);
        } catch (e) {
            // @ts-ignore
            this._key = e.path;
            // @ts-ignore
            this._message = 'params' in e ? e.message : e.message.substring(e.message.indexOf(e.path) + e.path.length).trim();
            this._messages = {[this._key]: this._message};
        }
        return this;
    }

    hasError(): boolean {
        return !!this._key;
    }

    message(): string {
        return this._message;
    }

    data(cast : boolean = true) : any{
        return cast ? this._schema?.cast(this._data) : this._data;
    }

    key(): string {
        return this._key;
    }

    toObject(): { [key: string]: string } {
        return this._messages;
    }
}

export default class Validator {
    static async make(props: {
        schema?: ObjectSchema<any>, custom?: (data: any) => void | { [key: string]: string }, data: any
    }) {
        return (new Validation(props?.schema, props?.custom)).run(props.data);
    }
}

export type validatorType<T> = (data : T) => Promise<Validation>;

export function validator<T>(props: {
    schema?: ObjectSchema<any>, custom?: (data: any) => void | { [key: string]: string }
}) : validatorType<T>{
    return async (data : T) => {
        return await Validator.make({...props,data});
    }
}