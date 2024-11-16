import Meta from "./Meta";

export default class Head {
    static meta = Meta;

    static setTitle(value: string): void {
        document.title = value;
    }

    static getTitle(): string {
        return document.title;
    }

    static hasTitle(): boolean {
        return !!document.title;
    }
}
