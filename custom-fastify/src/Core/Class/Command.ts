export default abstract class Command<ARGS = any, T = any> {
    protected abstract command: string;

    public abstract handle(args: ARGS[]): Promise<T>;
}