import {Accessor, createSignal, Setter} from "solid-js";
import str from "../Helper/Str";

export default class DataObject<T = { [key: string]: any }> {
    public all: Accessor<T>;
    public set: Setter<T>;

    constructor(init: T = {} as any) {
        const [all, setAll] = createSignal<T>(init, {
            equals: false,
        });
        this.all = all;
        this.set = setAll;
    }

    get (key : string,def = null){
        const _ = this.all();
        if(key in _)
            return _[key] !== undefined && _[key] !== null && _[key] !== '' ? _[key] : def;
        return def;
    }

    filterKeys(keys: string[] = [], withKeys = true) {
        if (keys.length === 0)
            return this.all();
        let _keys = withKeys ? Object.keys(this.all()).filter((k) => keys.includes(k)) :
            Object.keys(this.all()).filter((k) => !keys.includes(k));
        const _ = {};
        for (let k of _keys)
            _[k] = this.all()[k]
        return _;
    }

    setKey(key: string, value: any) {
        const _ = this.all();
        _[key] = value;
        this.set(_);
        return this;
    }

    merge(data: T) {
        this.set({...this.all(), ...data});
        return this;
    }

    clear() {
        this.set({});
        return this;
    }

    gather(obj: object, keys: string[]) {
        for (let key of keys)
            this.setKey(key, key in obj ? obj[key] : null);
        return this;
    }
}

export class DataArray<T = any> {
    public all: Accessor<T[]>;
    public set: Setter<T[]>;

    constructor(init: T[] = []) {
        const [all, setAll] = createSignal<T[]>(init, {equals: false});
        this.all = all;
        this.set = setAll;
    }

    push(item) {
        this.all().push(item);
        this.set(this.all());
    }

    at(index: number) {
        return this.all()[index];
    }

    length() {
        return this.all().length;
    }

    empty() {
        return this.length() === 0;
    }

    toggle(item: T) {
        const _ = this.all();
        const index = this.indexOf(item);
        if (index > -1)
            _.splice(index, 1);
        else
            _.push(item);

        this.set(_);
        return this;
    }

    sort() {
        const _ = this.all();
        _.sort();
        this.set(_);
        return this;
    }

    has(item: T) {
        return this.all().includes(item);
    }

    indexOf(item: T) {
        return this.all().indexOf(item);
    }

    first() {
        return this.at(0);
    }

    last() {
        return this.at(this.length() - 1);
    }

    clear() {
        this.set([]);
        return this;
    }

    remove(index: number) {
        this.all().splice(index, 1);
    }
}