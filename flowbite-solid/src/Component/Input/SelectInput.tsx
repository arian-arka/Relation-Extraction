import {Component, createSignal, For, JSX, Show} from "solid-js";

export interface SelectInputProps {
    label?: string,
    onChange?: (value: string, e?: any) => boolean | void,
    disabled?: boolean,
    hintText?: string,
    error?: {
        text: string,
        has?: boolean
    },
    class?: string,
    containerClass?: string,
    size?: 'small' | 'base' | 'large',
    value?: string,
    options?: {
        value: any,
        text?: string,
    }[]
}


const SelectInput: Component<SelectInputProps> = (props?: SelectInputProps) => {
    const defaultClass = {
        'large': 'block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'base': 'bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'small': 'block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
    };
    const hintClass = {
        true: 'mt-2 text-sm text-red-600 dark:text-red-500',
        false: 'mt-2 text-sm text-green-600 dark:text-green-500',
        'default': 'mt-2 text-sm text-gray-500 dark:text-gray-400'
    }

    const options = (opts: {
        value: any,
        text?: string,
    }[]) => {
        return (
            <For each={opts}>
                {
                    (o,index) => <Show when={
                        `${o.value}` ===  `${props?.value ?? ''}`
                    } fallback={
                        <option value={`${o.value}`}>{!!o?.text ? `${o.text}` : `${o.value}`}</option>
                    }>
                        <option selected value={`${o.value}`}>{!!o?.text ? `${o.text}` : `${o.value}`}</option>
                    </Show>
                }
            </For>
        );
    }

    const onChange = async (value : string,e :  Event & {currentTarget: HTMLSelectElement, target: HTMLSelectElement}) => {
        if (props?.onChange){
            await props.onChange(value,e);
        }
    }

    return (
        <div class={props?.containerClass ??` mb-4`}>

            <Show when={!!props?.label}>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props?.label}
                </label>
            </Show>

            <Show when={props?.disabled === true} fallback={
                <select
                    onChange={async (e) => {
                            await onChange(e.target.options[e.target.selectedIndex].value as string, e);
                    }}
                    class={props?.class ?? defaultClass[props?.size ?? 'base']}
                    value={props?.value ?? ''}
                >
                    {options(props?.options ?? [])}
                </select>
            }>
                <select
                    onChange={async (e) => {
                            await onChange(e.target.options[e.target.selectedIndex].value as string, e);
                    }}
                    class={props?.class ?? defaultClass[props?.size ?? 'base']}
                    value={props?.value ?? ''}
                    disabled
                >
                    {options(props?.options ?? [])}
                </select>
            </Show>


            <Show when={!!props?.hintText} fallback={
                <Show when={!!props?.error?.text}>
                    <p class={hintClass[props?.error?.has ?? true]}>
                        {props?.error?.text}
                    </p>
                </Show>
            }>
                <p class={hintClass.default}>
                    {props?.hintText}
                </p>
            </Show>

        </div>
    );
}

export default SelectInput;