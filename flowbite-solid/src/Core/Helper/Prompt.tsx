import {createSignal, createContext, useContext, Show, Switch, Match, JSX, Setter} from "solid-js";
import Response from "../Class/Response";
import Lang from "./Lang";
import Button from "../../Component/Button/Button";

const PromptContext = createContext();

interface PromptInterface {
    clear(): void,

    setSwipeable(props: {
        header?: string,
        children: string | JSX.Element
    }): void,

    swipeableDelete(props: {
        header?: string,
        onClick: (setloading : Setter<boolean>) => void
    }): void,

    setSide(props: {
        header: string,
        align?: 'left' | 'right',
        children: string | JSX.Element
    }): void,

}

export function PromptProvider(props: any) {
    const defaultClass = {
        swipeable: `fixed z-50 w-full overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 `,
        side: ` fixed top-0  z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 transform-none`,
    };

    const [children, setChildren] = createSignal<any>(undefined, {equals: false});

    const tmp: PromptInterface = {
        clear: () => setChildren(undefined),
        setSwipeable: (props: {
            header?: string,
            children: string | JSX.Element
        }) => {
            setChildren(
                <>
                    <div
                        class={`transform-none ${defaultClass.swipeable}`}
                        tabindex="-1" aria-labelledby="drawer-swipe-label" aria-modal="true" role="dialog">
                        <div onClick={() => {
                            setChildren(undefined);
                        }} class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                             data-drawer-toggle="drawer-swipe">
                    <span
                        class="absolute w-8 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
                            <h5 class="text-center items-center text-base text-gray-500 dark:text-gray-400 font-medium">
                                {props?.header ?? ''}
                            </h5>
                        </div>
                        <div class="">
                            {props.children}
                        </div>
                    </div>
                </>
            )
        },

        swipeableDelete(props: { header?: string; onClick: (setloading: Setter<boolean>) => void }) {
            tmp.setSwipeable({
                header:props?.header ?? <span class="text-orange-500">Are you sure?</span>,
                children: <>
                    <div class=" grid content-center justify-items-center my-4">
                        <div class="inline-flex rounded-md shadow-sm space-x-3">
                            <Button onClick={props.onClick}
                                    class="text-red-600 items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                Delete
                            </Button>
                            <button type="button" onClick={() => tmp.clear()}
                                    class="text-gray-600 items-center hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900">
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            });
        },

        setSide(props: { header: string; align?: "left" | "right", children: string | JSX.Element }) {
            const cls = `${props?.align ?? 'left'}-0 ${defaultClass.side}`
            setChildren(<>
                <div class={cls} tabindex="-1" aria-labelledby="drawer-form-label" aria-modal="true" role="dialog">
                    <h5 class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
                        {props?.header}
                    </h5>
                    <button onClick={() => setChildren(undefined)} type="button" data-drawer-hide="drawer-form"
                            aria-controls="drawer-form"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                        </svg>
                        <span class="sr-only">Close menu</span>
                    </button>
                    <div class="mb-6">
                        {props?.children ?? ''}
                    </div>
                </div>
            </>);
        }
    };

    return (
        <PromptContext.Provider value={tmp}>

            {props.children}
            <Show when={children()}>
                <>
                    {children()}
                    <div drawer-backdrop="" onClick={() => setChildren(undefined)}
                         class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
                </>
            </Show>

        </PromptContext.Provider>
    );
}

export function usePrompt(): PromptInterface {
    return useContext(PromptContext) as PromptInterface;
}