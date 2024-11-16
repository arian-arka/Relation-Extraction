import {Component, createSignal, For, Show} from "solid-js";
import Lang from "../../Core/Helper/Lang";
import {useHelper} from "../../Core/Helper/Helper";

export interface TablePaginationProps {
    pages?: number[],
    next?: number,
    previous?: number,
    total?: number,
    totalSoFar?: number,
    lastPage?: number,
    firstPage?: number,
    onPage?: (page: number) => void,
    hidden?: boolean,
    limit?:number,
    current?:number,
}

const TablePagination: Component<TablePaginationProps> = (props?: TablePaginationProps) => {
    const helper = useHelper();
    const isLtr = helper.storage.get('dir','ltr') === 'ltr';
    return (
        <>
            <Show when={props?.hidden !== true}>
                <nav
                    class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                    aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                   {Lang.get('table.pagination.showingOf', props ?? {})}
                         </span>
                    <ul class="inline-flex items-stretch -space-x-px">
                        <Show when={props?.previous}>
                            <li>
                                <button onClick={async () => {
                                    await props?.onPage(props?.previous)
                                }}
                                        class={`flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white ${isLtr ? 'rounded-l-lg' : 'rounded-r-lg'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>

                                    <Show when={isLtr} fallback={
                                        <>
                                            <span class="sr-only">Next</span>
                                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </>
                                    }>

                                        <span class="sr-only">Previous</span>
                                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                    </Show>
                                </button>
                            </li>
                        </Show>
                        <Show when={props?.firstPage}>
                            <li>
                                <button
                                    onClick={async () => {
                                        await props?.onPage(props?.firstPage)
                                    }}
                                    class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">

                                    {Lang.get('table.paginationFirstPage')}
                                </button>
                            </li>
                        </Show>
                        <For each={props?.pages ?? []}>{(page) =>
                            <li>
                                <button
                                    onClick={async () => {
                                        await props?.onPage(page)
                                    }}
                                    class={page == props?.current?
                                        'flex items-center justify-center px-3 py-2 h-full text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                                        'flex items-center justify-center text-sm py-2 px-3 h-full leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                }
                                    >
                                    {page}
                                </button>
                            </li>
                        }</For>
                        <Show when={props?.lastPage}>
                            <li>
                                <button
                                    onClick={async () => {
                                        await props?.onPage(props?.lastPage)
                                    }}
                                    class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">

                                    {Lang.get('table.paginationLastPage')}
                                </button>
                            </li>
                        </Show>
                        <Show when={props?.next}>
                            <li>
                                <button onClick={async () => {
                                    await props?.onPage(props?.next)
                                }}
                                        class={`flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white ${isLtr ? 'rounded-r-lg' : 'rounded-l-lg'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                                  <Show when={isLtr} fallback={
                                  <>
                                      <span class="sr-only">Previous</span>
                                      <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                           xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clip-rule="evenodd"/>
                                      </svg>
                                  </>
                                  }>
                                    <span class="sr-only">Next</span>
                                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                  </Show>

                                </button>
                            </li>
                        </Show>

                    </ul>
                </nav>
            </Show>

        </>
    );
}
export default TablePagination;