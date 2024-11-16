import * as path from "path";


class Path {
    src(...args: string[]): string {
        return path.join(__dirname, './../../', ...args);
    }
    base(...args: string[]): string {
        return this.src('../',...args);
    }
    app(...args: string[]): string {
        return this.src('App',...args);
    }
    core(...args: string[]): string {
        return this.src('Core',...args);
    }
    lang(...args: string[]): string {
        return this.src('Lang',...args);
    }
    public(...args: string[]): string {
        return this.src('../','public',...args);
    }
    plugins(...args: string[]): string {
        return this.src('Plugins',...args);
    }
}

export default new Path();