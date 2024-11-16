import {Component, createEffect, createSignal, For, Show} from "solid-js";

export interface SwipeableBottomPromptProps {
    collapseable?: boolean,
    header?: string,
    open?: boolean,
    class?: string,
}

const SwipeableBottomPrompt: Component<SwipeableBottomPromptProps> = (props?: SwipeableBottomPromptProps) => {
    const [show, setShow] = createSignal(true);
    const defaultClass = `fixed z-50 w-full overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 `;
    createEffect(() => setShow(props?.open ?? false));
    return (
        <>
            <div
                class={`${show() ? 'transform-none' : 'translate-y-full bottom-[60px]'} ${props?.class ?? defaultClass}`}
                tabindex="-1" aria-labelledby="drawer-swipe-label" aria-modal="true" role="dialog">
                <div onClick={() => setShow(c => !c)} class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                     data-drawer-toggle="drawer-swipe">
                    <span
                        class="absolute w-8 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
                    <h5 class="text-center items-center text-base text-gray-500 dark:text-gray-400 font-medium">
                        {props?.header ?? ''}
                    </h5>
                </div>
                <div class="">
                    {props?.children ?? ''}
                </div>
            </div>

            <Show when={show()}>
                <div drawer-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
            </Show>
        </>
    );
}
export default SwipeableBottomPrompt;