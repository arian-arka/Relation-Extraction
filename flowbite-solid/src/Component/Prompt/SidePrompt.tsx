import {Component, createEffect, createSignal, For, Show} from "solid-js";

export interface SidePromptProps {
    header?:string,
    open?:boolean,
    class?:string,
    align?:'left' | 'right'
}

const SidePrompt: Component<SidePromptProps> = (props?: SidePromptProps) => {
    const [show, setShow] = createSignal(true);
    const defaultClass = `fixed top-0 ${props?.align ?? 'left'}-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 transform-none`;
    createEffect(() => setShow(props?.open ?? false));
    return (
        <>
            <div class={`${show() ? '' : 'hidden'} ${props?.class ?? defaultClass}`} tabindex="-1" aria-labelledby="drawer-form-label" aria-modal="true" role="dialog">
                <h5  class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
                    {props?.header ?? ''}
                </h5>
                <button onClick={() => setShow(c => !c)} type="button" data-drawer-hide="drawer-form" aria-controls="drawer-form" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
                <div class="mb-6">
                    {props?.children ?? ''}
                </div>
            </div>

            <Show when={show()}>
                <div drawer-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
            </Show>
        </>
    );
}
export default SidePrompt;