import Loader from "./Loader";
import Path from "./Path";

class Lang {
    private readAll() {
        Loader.js(Path.lang(), (name: string, ext: string, path: string) => {
            this._templates[name] = require(path).default;
        });
    }

    constructor(private _current: string = 'en') {
        this.readAll();
    }

    private _templates: { [key: string]: any } = {};

    current() : string{
        return this._current;
    }
    generate(keys : string,...args : any[]) : string{
        let val = this._templates[this.current()];

        for(let key of keys.split('.'))
            val = val[key];

        return typeof val === 'function' ? val(...args) : val;
    }

    pair(key : string,keys : string,...args : any[]) : {[key : string] : string}{
        return {
            [key] : this.generate(keys,...args)
        };
    }

}
export default new Lang;