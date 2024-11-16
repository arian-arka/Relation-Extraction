import {Component, createSignal, For, Show} from "solid-js";
import {TableProps} from "./Table";
import Lang from "../../Core/Helper/Lang";

export interface TableHeaderProps {
    collapseable?: boolean,
    header?:string,
    class?:string,
    headerClass?:string,
}

const TableHeader: Component<TableHeaderProps> = (props?: TableHeaderProps) => {
    const [show, setShow] = createSignal(false);
    return (
        <>
            <div>
                <h2 >
                    <Show when={props?.collapseable ?? true} fallback={
                        <>

                        </>
                    }>
                        <Show when={show()} fallback={
                            <button onClick={() => setShow(c => !c)} type="button"
                                    class=" flex items-center justify-between w-full p-5 font-medium text-left border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                                    data-accordion-target="#accordion-collapse-body-1" aria-expanded="false"
                                    aria-controls="accordion-collapse-body-1">
                                {props?.header ?? Lang.get('table.header.filterHeadingOpen')}
                            </button>
                        }>
                            <button onClick={() => setShow(c => !c)} type="button"
                                    class="flex items-center justify-between w-full p-5 font-medium text-left border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                                    data-accordion-target="#accordion-collapse-body-1" aria-expanded="true"
                                    aria-controls="accordion-collapse-body-1">
                                {props?.header ?? Lang.get('table.header.filterHeadingClose')}
                            </button>
                        </Show>
                    </Show>
                </h2>
                <div
                    class={`${show() ? '' : 'hidden'} ${props?.class ?? 'flex flex-col items-center justify-between space-y-1 md:space-y-0 md:space-x-1 p-1'}`}>
                    <Show when={Array.isArray(props?.children)} fallback={
                        <div class="w-full p-1">
                            {props?.children}
                        </div>
                    }>
                    <For each={props?.children ?? []}>{(child) =>
                        <div class="w-full p-1">
                            {child}
                        </div>
                    }</For>
                    </Show>
                </div>
            </div>
        </>
    );
}
export default TableHeader;