import {createContext, createSignal, onCleanup, useContext} from "solid-js";
import {useLocation, useNavigate} from "@solidjs/router";

import Url from "./Url";

const HelperContext = createContext();

const parseOne = (val: string | null) => {
    4
    if (!!val) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    } else
        return null;
}

const localStorageToObj = () => {
    const data: any = {};
    let tmp;
    for (let key of Object.keys(localStorage))
        data[key] = parseOne(localStorage.getItem(key));

    return data;
}

export interface HelperInterface {

    url: {
        subscribe(name: string, callback: (current: URL, previous: URL | undefined) => void): void,
        unsubscribe(name: string): void,
        current(): URL,
        querytoString() : string,
        previous(): URL | undefined,
        setQuery(values: { [key: string]: any }): void,
        query(key: string, def: any): string,
    }

    storage: {
        all(): any,
        get(key: string, def?: any): any,
        set(key: string, val: any): void,
        unset(key: string): void,
        clear(fireEvents: false): void,
        subscribe(name: string, callback: (all: { [key: string]: any }, changedData: {
            [key: string]: any
        }) => void): void,
        unsubscribe(name: string): void,
    },

    page: {
        all(): any,
        get(key: string, def?: any): any,
        set(key: string, val: any): void,
        unset(key: string): void,
        clear(fireEvents: false): void,
        subscribe(name: string, callback: (all: { [key: string]: any }, changedData: {
            [key: string]: any
        }) => void): void,
        unsubscribe(name: string): void,
    }

    route(key: string): void,

    redirect(url: string): void,

    away(url: string): void,

}

export function HelperProvider(props: any) {
    const navigate = useNavigate();
    const _location = useLocation();

    const [pageVars, setPageVars] = createSignal<any>({}, {equals: false});
    const [toast, setToast] = createSignal<boolean>(false);
    const storageCallbacks: any = {};
    const pageVarsCallbacks: any = {};
    const urlCallbacks: any = {};

    const onUrl = () => {
        const complete = new URL(window.location.href);
        const completePrevious = !!document.referrer ? new URL(document.referrer) : undefined;
        for (let key in urlCallbacks)
            urlCallbacks[key](complete, completePrevious);
    }

    window.onhashchange = onUrl;

    //onPage
    const onPage = (changedKey?: string) => {
        const _ = pageVars();
        for (let key in pageVarsCallbacks)
            pageVarsCallbacks[key](_, !!changedKey ? {[changedKey]: _[changedKey]} : _);
    }


    const onStorage = (event: StorageEvent | undefined) => {
        const oldValue = parseOne(event?.oldValue ?? null);
        const newValue = parseOne(event?.newValue ?? null);

        const all = localStorageToObj();


        for (let key in storageCallbacks) {
            storageCallbacks[key](all, event?.key, oldValue, newValue);
        }
    }

    addEventListener("storage", onStorage);

    onCleanup(() => {
        removeEventListener('storage', onStorage);
    })

    const all: HelperInterface = {
        'url': {
            subscribe(name: string, callback: (current: URL, previous: (URL | undefined)) => void) {
                urlCallbacks[name] = callback;
            },
            unsubscribe(name: string) {
                if (name in urlCallbacks) delete urlCallbacks[name];
            },
            current(): URL {
                return new URL(window.location.href)
            },
            previous(): URL | undefined {
                return !!document.referrer ? new URL(document.referrer) : undefined;
            },
            querytoString(){
                return new URLSearchParams(window.location.search).toString();
            },
            setQuery(values: { [p: string]: any }) {
                const queryParams = new URLSearchParams(window.location.search);
                for (let key in values){
                    if (values[key] !== null && values[key] !== undefined)
                        queryParams.set(key, values[key]);
                    else if(queryParams.has(key))
                        queryParams.delete(key);
                }
                // @ts-ignore
                history.replaceState(null, null, "?" + queryParams.toString());
            },
            query(key: string, def = '') {
                const _ = this.current().searchParams.get(key);
                return _ === undefined || _ === null ? def : _;
            }
        },
        'page': {
            set(key: string, val: any) {
                const _ = pageVars();
                _[key] = val;
                setPageVars(_);
                onPage(key);
            },
            get(key: string, def = null): any {
                const _ = pageVars();
                const v = key in _ ? _[key] : null;
                return v === null || v === undefined ? def : v;
            },
            all(): any {
                return pageVars();
            },
            unset(key: string) {
                const _ = pageVars();
                key in _ ? delete _[key] : null;
                onPage(key);
            },
            clear() {
                setPageVars({});
                onPage(undefined);
            },
            subscribe(name: string, callback: (all: { [p: string]: any }, changedData: { [p: string]: any }) => void) {
                pageVarsCallbacks[name] = callback;
            },
            unsubscribe(name: string) {
                if (name in pageVarsCallbacks) delete pageVarsCallbacks[name];
            }
        },
        'storage': {
            all() {
                return localStorageToObj();
            },
            set(key: string, val: any) {
                const oldValue = this.get(key);
                localStorage.setItem(key, JSON.stringify(val));
                // @ts-ignore
                onStorage({
                    key, newValue: val, oldValue
                })
            },
            get(key: string, def = null) {
                const _ = localStorageToObj();
                const v = key in _ ? _[key] : null;
                return v === null || v === undefined ? def : v;
            },
            unset(key: string) {
                localStorage.removeItem(key);
            },
            clear(fireEvents: false) {
                localStorage.clear();
            },
            subscribe(name: string, callback: (all: { [p: string]: any }, changedData: { [p: string]: any }) => void) {
                storageCallbacks[name] = callback;
            },
            unsubscribe(name: string) {
                if (name in storageCallbacks) delete storageCallbacks[name];
            }
        },
        route(key: string, ...args: any[]) {
            navigate(Url.frontWithBase(key, ...args));
        },
        redirect(url: string) {
            navigate(url);
        },
        away(url: string) {
            navigate(url);
        },

    };

    onStorage(undefined);


    return (
        <HelperContext.Provider value={all}>
            {props.children}
        </HelperContext.Provider>
    );
}

export function useHelper(): HelperInterface {
    return useContext(HelperContext) as HelperInterface;
}