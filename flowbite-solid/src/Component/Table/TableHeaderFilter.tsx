import {Component, createSignal, For, JSX, Match, Switch} from "solid-js";
import {TableProps} from "./Table";
import {Input} from "postcss";
import TextInput from "../Input/TextInput";
import SelectInput from "../Input/SelectInput";
import RadioInput from "../Input/RadioInput";
import CheckboxInput from "../Input/CheckboxInput";

export interface TableHeaderFilterProps {
    gridCols?:number,
    filters?: (
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
            subscribe: (onChange: (val: any) => void) => void
        }
        )[],
    onChange : (all : { [key: string]: any }) => {}
}

const TableHeaderFilter: Component<TableHeaderFilterProps> = (props?: TableHeaderFilterProps) => {

    const data: { [key: string]: any } = {};
    const setData = (key: string, value: any) => {
        data[key] = value;
    }

    const onChange = async (key: string, value: string, cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any)) => {
        switch (cast) {
            case 'string':
                setData(key, `${value}`);
                break;
            case 'number' :
                setData(key, parseInt(value));
                break;
            case 'bool' :
            case 'boolean' :
                setData(key, !!value);
                break;
            default:
                if (cast)
                    setData(key, cast(value));
                else
                    setData(key,value);
                break;
        }
        await props?.onChange(data);

    }

    return (
        <>
            <div class="p-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
                <div class="w-full">
                    <div class={`grid grid-cols-1 xl:grid-cols-${props?.gridCols ?? 3} lg:grid-cols-${props?.gridCols ?? 3} md:grid-cols-${props?.gridCols ?? 2} sm:grid-cols-2 gap-4`}>
                        <For each={props?.filters ?? []}>{(filter) =>
                            <div class={`col-span-${filter?.size ?? 1}`}>
                                <Switch>
                                    <Match when={filter.type === 'text'}>
                                        <TextInput
                                            type="text"
                                            label={filter.label}
                                            value={filter?.value}
                                            placeholder={filter?.placeholder}
                                            onChange={async (value: string) => await onChange(filter.key, value, filter.cast)}
                                        />
                                    </Match>
                                    <Match when={filter.type === 'select'}>
                                        <SelectInput
                                            label={filter.label}
                                            value={filter?.value}
                                            onChange={async (value: string) => await onChange(filter.key, value, filter.cast)}
                                            options={filter?.options ?? []}
                                        />
                                    </Match>
                                    <Match when={filter.type === 'checkbox'}>
                                        <CheckboxInput
                                            label={filter.label}
                                            checked={filter?.checked}
                                            onChange={async (value: boolean) => await onChange(filter.key, value, filter.cast)}
                                        />
                                    </Match>
                                    <Match when={filter.type === 'radio'}>
                                        <RadioInput
                                            name={filter.key}
                                            label={filter.label}
                                            checked={filter?.checked}
                                            onChange={async (value: boolean) => await onChange(filter.key, value, filter.cast)}
                                        />
                                    </Match>
                                    <Match when={filter.type === 'custom'}>
                                        {
                                            (() => {
                                                filter.subscribe(async (val: any) => await onChange(filter.key, val, filter.cast));
                                                return filter.element;
                                            })()
                                        }
                                    </Match>
                                </Switch>
                            </div>
                        }</For>
                    </div>
                </div>
            </div>
        </>
    );
}
export default TableHeaderFilter;