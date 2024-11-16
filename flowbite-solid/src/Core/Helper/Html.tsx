import Head from "./Head";

export default class Html {
    static head = Head;

    static get(){
        return document.documentElement;
    }

    static setLang(value: string): void {
        const _ = document.documentElement;
        _.lang = value;
    }

    static getLang(): string {
        return document.documentElement.lang;
    }

    static hasLang(): boolean {
        return !!document.documentElement.lang;
    }

    static isLang(value: string): boolean {
        return Html.getLang() === value;
    }

    static setDir(value: string): void {
        const _ = document.documentElement;
        _.dir = value;
    }

    static getDir(): string {
        return document.documentElement.dir;
    }

    static isDirRtl(): boolean {
        return Html.getDir() === 'rtl';
    }

    static isDirLtr(): boolean {
        return Html.getDir() === 'ltr';
    }

    static hasDir(): boolean {
        return !!document.documentElement.dir;
    }
}
