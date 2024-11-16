import {FastifyReply} from "fastify";

export class Respond<T = any> {
    private _data : T = {} as T;

    constructor(data : T = {} as T) {
        this._data = data;
    }

    public status(){
        return 200;
    };

    public data(): T {
        return this._data;
    }

    static with<T>(data : T){
        return (new this(data));
    }

    public async reply(reply: FastifyReply) {
        reply.status(this.status()).send(this.data());
    }
}
export class Forbidden<T = any> extends Respond<T> {
    status(): number {
        return 403;
    }
}
export class Unauthorized<T = any> extends Respond<T> {
    status(): number {
        return 401;
    }
}

export class NotFound<T = any> extends Respond<T> {
    status(): number {
        return 404;
    }
}

export class BadRequest extends Respond {
    constructor(protected _messages: string|{ [key: string]: string }) {
        super();
    }

    data() {
        return {
            messages : this._messages
        };
    }

    status(): number {
        return 400;
    }

    static messages(messages: { [key: string]: string } = {}) {
        return new BadRequest(messages);
    }
    static message(message : string){
        return new BadRequest(message);
    }

}

