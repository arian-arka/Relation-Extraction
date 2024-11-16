import {Component, For, Show} from "solid-js";

const TableFilterList: Component<{
    data?: { [key: string]: any },
    keys?: string[],
    onDelete: (key: string) => void
    dontShow?:string[],
}> = (props) => {


    return (
        <>
            <div
                class="p-2 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
                <div class="w-full">
                    <For each={Object.keys(props?.data ?? {})}>{(key) =>
                        <Show
                             when={(!props?.keys || (!props?.dontShow?.includes(key) && props.keys.includes(key)) && props?.data[key] !== undefined && props?.data[key] !== null && props?.data[key] !== '')}>
                            <button type="button" onClick={async () => {
                                await props?.onDelete(key);
                            }}
                                    class="text-red-700 hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                <svg class="inline w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="px-1 inline">
                                                   {props?.data[key] ?? ''}
                                               </span>
                            </button>
                        </Show>
                    }</For>
                </div>
            </div>
        </>
    );
}
export default TableFilterList;