import {JSONSchemaType} from "ajv";


export abstract class Response<T = any> {
    // public response(): JSONSchemaType<any> {
    //     return {type: 'object'};
    // }

    public abstract schema(): JSONSchemaType<T>;

}

