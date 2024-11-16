export abstract class Listener<DataSchema = any> {
    public abstract dispatch(props: DataSchema): any;

    public static async call<DataSchema>(props: DataSchema) {
        return await (new (this as any)).dispatch(props);
    }
}

export default abstract class Event<DataSchema = any> {
    protected abstract listeners: Listener<DataSchema> | Function[];

    public static async fire<DataSchema = any>(props: DataSchema) {
        for (let listener of (new (this as any)).listeners)
            listener instanceof Listener ? await listener.dispatch(props) : await listener.call(props);
    }
}
