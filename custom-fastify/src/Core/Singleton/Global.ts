class Global {
    private _data: { [key: string]: any } = {};


    set(key: string, value: any) {
        this._data[key] = value;
        return this;
    }

    get(key: string) {
        return this._data[key];
    }
}
export default new Global();