import {Component, createSignal, For, JSX, Match, Setter, Show, Switch} from "solid-js";
import Lang from "../../Core/Helper/Lang";
import TableHeader from "./TableHeader";
import SidePrompt from "../Prompt/SidePrompt";
import TextInput from "../Input/TextInput";
import SelectInput from "../Input/SelectInput";
import CheckboxInput from "../Input/CheckboxInput";
import RadioInput from "../Input/RadioInput";
import TablePagination from "./TablePagination";

export interface TableProps {
    rows?: any[],
    pagination?:JSX.Element | {
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
    },
    columns?: {
        key: string,
        text?: string | ((...args: any[]) => string),
        value?: (value:any,row : any) => string | JSX.Element,
        tdClass?:string,
        thClass?:string,
    }[],
    onPage?: (page: number, filters: any) => void,
    sideFilters?: (
        {

            label: string,
            placeholder?: string,
            size?: number,
            type: 'text',
            key: string,
            value?: string,
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any)
        } |
        {
            label: string,
            size?: number,
            type: 'select',
            key: string,
            value?: string,
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            options?: {
                value: any,
                text?: string,
            }[]
        } |
        {
            label: string,
            size?: number,
            type: 'checkbox',
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            key: string,
            checked?: boolean,
        } |
        {
            label: string,
            size?: number,
            type: 'radio',
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            key: string,
            checked?: boolean,
            value?: string,
        } |
        {
            size?: number,
            type: 'custom',
            key: string,
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            element: JSX.Element,
            subscribe: (onChange: (val: any) => void) => void,
            defaultValue?: any,
        }
        )[],
    onSideFilters?: (data: any) => void,
    header?: string | JSX.Element,
    rowClass?:string,
}


const Table: Component<TableProps> = (props?: TableProps) => {
    const defaultRowClass = `border-b dark:border-gray-700`;
    const defaultTdClass = `px-4 py-3 `;
    const defaultThClass = `px-4 py-3 `;
    const defaultSideFilters: any = [...props?.sideFilters ?? []];
    const defaultSideFiltersData = {};
    for (let f of props?.sideFilters ?? []) {
        switch (f.type) {
            case 'select':
            case 'text':
                defaultSideFiltersData[f.key] = f?.value ?? '';
                break;
            case 'checkbox':
                defaultSideFiltersData[f.key] = f?.checked ?? false;
                break;
            case 'radio':
                if (f?.checked === true)
                    defaultSideFiltersData[f.key] = f?.value ?? '';
                break;
            case 'custom':
                defaultSideFiltersData[f.key] = f?.defaultValue ?? '';
                break;
        }
    }
    const [filters, setFilters] = createSignal(defaultSideFilters, {equals: false});

    let sideFilterData: any = {...defaultSideFiltersData};

    const onFilterChange = async (key: string, value: string, cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any)) => {
        console.log(key, value, cast);
        switch (cast) {
            case 'string':
                sideFilterData[key] = `${value}`;
                break;
            case 'number' :
                sideFilterData[key] = parseInt(value);
                break;
            case 'bool' :
            case 'boolean' :
                sideFilterData[key] = !!value;
                break;
            default:
                sideFilterData[key] = cast ? cast(value) : value;
                break;
        }

    }

    const generateSideFilters = (filters: (
        {

            label: string,
            placeholder?: string,
            size?: number,
            type: 'text',
            key: string,
            value?: string,
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any)
        } |
        {
            label: string,
            size?: number,
            type: 'select',
            key: string,
            value?: string,
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            options?: {
                value: any,
                text?: string,
            }[]
        } |
        {
            label: string,
            size?: number,
            type: 'checkbox',
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            key: string,
            checked?: boolean,
        } |
        {
            label: string,
            size?: number,
            type: 'radio',
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            key: string,
            checked?: boolean,
            value?: string,
        } |
        {
            size?: number,
            type: 'custom',
            key: string,
            cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
            element: JSX.Element,
            subscribe: (onChange: (val: any) => void) => void,
            defaultValue?: any,
        }
        )[]) => {
        return (
            <>
                <For each={filters}>{(filter) =>
                    <div>
                        <Switch>
                            <Match when={filter.type === 'text'}>
                                <TextInput
                                    type="text"
                                    label={filter.label}
                                    value={filter?.value}
                                    placeholder={filter?.placeholder}
                                    onChange={async (value: string) => onFilterChange(filter.key, value, filter.cast)}
                                />
                            </Match>
                            <Match when={filter.type === 'select'}>
                                <SelectInput
                                    label={filter.label}
                                    value={filter?.value}
                                    onChange={async (value: string) => onFilterChange(filter.key, value, filter.cast)}
                                    options={filter?.options ?? []}
                                />
                            </Match>
                            <Match when={filter.type === 'checkbox'}>
                                <CheckboxInput
                                    label={filter.label}
                                    checked={filter?.checked}
                                    onChange={async (value: boolean) => onFilterChange(filter.key, value, filter.cast)}
                                />
                            </Match>
                            <Match when={filter.type === 'radio'}>
                                <RadioInput
                                    name={filter.key}
                                    label={filter.label}
                                    checked={filter?.checked}
                                    onChange={async (value: boolean) => onFilterChange(filter.key, value, filter.cast)}
                                />
                            </Match>
                            <Match when={filter.type === 'custom'}>
                                {
                                    (() => {
                                        filter.subscribe(async (val: any) => onFilterChange(filter.key, val, filter.cast));
                                        return filter.element;
                                    })()
                                }
                            </Match>
                        </Switch>
                    </div>
                }</For>
            </>
        );

    }

    return (
        <>

            <section class="shadow-md sm:rounded-lg bg-gray-50 dark:bg-gray-900 p-1 sm:p-1">
                <div class="mx-auto  px-1 lg:px-1">
                    <div class="relative  overflow-hidden">

                        {props?.header ?? ''}

                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead
                                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <For each={props?.columns ?? []}>{(column) =>
                                        <th scope="col" class={column?.thClass ?? defaultThClass}>
                                            <Show when={!column?.text} fallback={typeof column.text === 'string' ? column.text : column.text()}>{column.key}</Show>
                                        </th>
                                    }</For>
                                </tr>
                                </thead>
                                <tbody>
                                <For each={props?.rows ?? []}>{(row) =>
                                    <tr class={props?.rowClass ?? defaultRowClass}>
                                        <For each={props?.columns}>{(column) =>
                                            <td class={column?.tdClass ?? defaultTdClass}>
                                                {
                                                    <Show when={column?.value} fallback={row[column.key]}>
                                                        {column.value(row[column.key],row)}
                                                    </Show>
                                                }
                                            </td>
                                        }</For>
                                    </tr>
                                }</For>

                                </tbody>
                            </table>
                        </div>

                        <Show fallback={
                            <Show when={typeof props?.pagination === 'object'}>
                                <TablePagination {...props?.pagination ?? {}} onPage={props?.onPage}/>
                            </Show>
                        } when={typeof props?.pagination === 'function'}>
                            {props?.pagination}
                        </Show>

                    </div>
                </div>
            </section>

            <Show when={props?.sideFilters?.length > 0}>
                <SidePrompt open={true} header={Lang.get('table.sideFilter.header')}>
                    {generateSideFilters(filters())}
                    <div class="mt-4 grid grid-cols-2 gap-4">
                        <button onClick={async () => {
                            sideFilterData = {...defaultSideFiltersData};
                            setFilters([...defaultSideFilters]);
                            // await props?.onSideFilters(sideFilterData);
                        }}
                                class="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            {Lang.get('table.sideFilter.defaultButton')}
                        </button>
                        <button onClick={async () => await props?.onSideFilters(sideFilterData)}
                                class=" items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            {Lang.get('table.sideFilter.applyButton')}
                        </button>
                    </div>
                </SidePrompt>
            </Show>

        </>
    );
}


export default Table;