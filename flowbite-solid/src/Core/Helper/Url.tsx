import Urls from "../../App/Urls";

export default class Url {
    static getValue(callback: (string | ((...args: any[]) => string)), ...args: any[]): string {
        if (typeof callback === "string")
            return callback;
        return callback(...args);
    }

    static frontBase(key?: string, ...args: any[]): string {
        if (!!key) { // @ts-ignore
            return Url.getValue(Urls.front.bases[key], ...args);
        }
        return Url.getValue(Urls.front.bases.default, ...args);
    }

    static backBase(key?: string, ...args: any[]): string {
        if (!!key) { // @ts-ignore
            return Url.getValue(Urls.back.bases[key], ...args);
        }
        return Url.getValue(Urls.back.bases.default, ...args);
    }

    static back(key: string, ...args: any[]) {
        // @ts-ignore
        return Url.getValue(Urls.back.urls[key], ...args);
    }

    static front(key: string, ...args: any[]) {
        // @ts-ignore
        return Url.getValue(Urls.front.urls[key], ...args);
    }

    static backWithBase(key: string,base?: string) : string{
        return new URL(Url.back(key),Url.backBase(base)).toString();
    }

    static frontWithBase(key: string,...args:any[]) : string{
        return new URL(Url.front(key,...args),Url.frontBase()).toString();
    }

}