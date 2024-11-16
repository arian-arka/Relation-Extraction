import {Component, createEffect, createSignal, For, onCleanup, Show} from "solid-js";
import {TABLE_LIMITS} from "../../App/Constants";
import Str from "../../Core/Helper/Str";
import {useHelper} from "../../Core/Helper/Helper";
import Lang from "../../Core/Helper/Lang";

const TableLimit: Component<{ limits?: number[], default?: number, onLimit?: (limit: number) => void }> = (props) => {
    const [show, setShow] = createSignal(false);
    const [checked, setChecked] = createSignal(props?.default ?? (props?.limits ? props.limits[0] : TABLE_LIMITS[0]));
    const helper = useHelper();
    const id = Str.random();

    const clickOutside = function (e, ignore = false) {
        if (!document.getElementById(id)?.contains(e.target) && show()) {
            setShow(false);
        }
    }

    window.addEventListener('click', clickOutside);

    onCleanup(() => window.removeEventListener('click', clickOutside));

    return (
        <div>
            <button onClick={(e) => {
                e.stopImmediatePropagation();
                setShow(!show());
                return false;
            }}
                    class="w-full justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button">
                {Lang.get('table.limit')}

                <svg class={`w-2.5 h-2.5 mx-2`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 4 4 4-4"/>
                </svg></button>

            <div id={id}
                 class={`${show() ? 'top-60 md:top-40 absolute m-0' : 'hidden'} w-auto z-10  bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 dark:divide-gray-600`}>
                <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownToggleButton">
                    <For each={props?.limits ?? TABLE_LIMITS}>{(limit) =>
                        <li>
                            <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <label class="relative inline-flex items-center w-full cursor-pointer">
                                    <Show when={limit === checked()} fallback={
                                        <input type="checkbox" onClick={async () => {
                                            setChecked(limit);
                                            if (props?.onLimit)
                                                await props.onLimit(limit);
                                        }} class="sr-only peer"/>
                                    }>
                                        <input type="checkbox" disabled checked class="sr-only peer"/>
                                    </Show>
                                    <div
                                        class={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] ${helper.storage.get('dir','ltr') === 'ltr' ? 'after:left-[2px]' : 'after:right-[17px]'} after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600`}>

                                    </div>
                                    <span
                                        class={`${helper.storage.get('dir','ltr') ==='ltr' ? 'ml-3' : 'mr-3'} text-sm font-medium text-gray-900 dark:text-gray-300`}>{limit}</span>
                                </label>
                            </div>
                        </li>

                    }</For>

                </ul>
            </div>

        </div>
    );
}
export default TableLimit;
