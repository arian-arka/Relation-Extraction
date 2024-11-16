import {Component, createSignal, For, JSX, Show} from "solid-js";

export interface RadioInputProps {
    name:string,
    label: string,
    onChange?: (value: boolean, e?: any) => boolean | void,
    disabled?: boolean,
    hintText?: string,
    error?: {
        text: string,
        has?: boolean
    },
    class?: string,
    containerClass?:string,
    checked?: boolean,
    value?:string,
}


const RadioInput: Component<RadioInputProps> = (props?: RadioInputProps) => {
    const defaultClass = "ml-2 text-sm font-medium text-gray-900 dark:text-gray-300";
    const hintClass = {
        true: 'mt-2 text-sm text-red-600 dark:text-red-500',
        false: 'mt-2 text-sm text-green-600 dark:text-green-500',
        'default': 'mt-2 text-sm text-gray-500 dark:text-gray-400'
    }

    const onChange = async (value: string, e:  Event & {currentTarget: HTMLInputElement, target: HTMLInputElement}) => {
        if (props?.onChange) {
            await props.onChange(value, e);
        }
    }

    return (
        <>

            <div class={props?.containerClass ??`flex items-center mb-4`}>

                <Show when={props?.disabled === true} fallback={
                    <Show when={props?.checked === true} fallback={
                        <>
                            <input name={props?.name} type="radio" onChange={async (e) => await onChange(e.target.checked ? (props?.value ?? '') : '' ,e)}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label
                                class={props?.class ?? defaultClass}>{props?.label}</label>
                        </>
                    }>
                        <>
                            <input name={props?.name} type="radio" checked onChange={async (e) => await onChange(e.target.checked ? (props?.value ?? '') : '',e)}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label
                                class={props?.class ?? defaultClass}>{props?.label}</label>
                        </>
                    </Show>

                }>
                    <Show when={props?.checked === true} fallback={
                        <>
                            <input name={props?.name} disabled type="radio" onChange={async (e) => await onChange(e.target.checked ? (props?.value ?? '') : '',e)}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label
                                class={props?.class ?? defaultClass}>{props?.label}</label>
                        </>
                    }>
                        <>
                            <input name={props?.name} disabled checked type="radio" onChange={async (e) => await onChange(e.target.checked ? (props?.value ?? '') : '',e)}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label
                                class={props?.class ?? defaultClass}>{props?.label}</label>
                        </>
                    </Show>
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

        </>
    );
}

export default RadioInput;