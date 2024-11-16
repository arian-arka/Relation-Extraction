export default class Meta {
    static property(property: string): string {
        const val = Meta.getByProperty(property)?.getAttribute('property')
        return !!val ? val : '';
    }

    static content(name: string): string {
        const val = Meta.get(name)?.getAttribute('content')
        return !!val ? val : '';
    }

    static hasProperty(property: string): boolean {
        return !!Meta.getByProperty(property)?.getAttribute('property');
    }

    static hasContent(name: string): boolean {
        return !!Meta.get(name)?.getAttribute('content');
    }

    static get(name: string): Element | null {
        return document.querySelector(`meta[name="${name}"]`);
    }

    static getByProperty(property: string): Element | null {
        return document.querySelector(`meta[property="${property}"]`);
    }

    static setContent(name: string, value: string): Meta {
        const _ = Meta.get(name);
        if (!_) {
            document.head.append(`<meta name=${name} content=${value}/>`)
        } else {
            _.setAttribute('content', value);
        }
        return Meta;
    }

    static setProperty(name: string, value: string): Meta {
        const _ = Meta.get(name);
        if (!_) {
            document.head.append(`<meta property="${name}" content="${value}/">`)
        } else {
            _.setAttribute('property', value);
        }
        return Meta;
    }
}