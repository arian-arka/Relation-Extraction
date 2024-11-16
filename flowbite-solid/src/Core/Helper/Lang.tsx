import Language from "../../App/Language";

class Lang {
    protected lang: string = 'en';

    constructor() {
    }

    setLang(lang: string) {
        this.lang = lang;
        return this;
    }

    get(key: string, ...args: any[]): string {
        // @ts-ignore
        let l = Language[this.lang];
        for (let k of key.split('.'))
            l = l[k];
        if (typeof l === 'function')
            return l(...args);
        return l;
    }
}

export default new Lang();