import {Accessor, Component, createEffect, createSignal, JSX, Show} from "solid-js";

export interface TextAreaProps {
    label?: string,
    onInput?: (value: string, e?: any) => boolean | void,
    onChange?: (value: string, e?: any) => boolean | void,
    onKeyUp?: (key: string, value: string, e?: any) => boolean | void,
    disabled?: boolean,
    placeholder?: string,
    hintText?: string,
    icon?: JSX.Element,
    error?: {
        text: string | Accessor<string>,
        has?: boolean
    },
    minlength?: number,
    maxlength?: number,
    class?: string,
    containerClass?: string,
    size?: 'small' | 'base' | 'large',
    value?: string,
}


const TextArea: Component<TextAreaProps> = (props?: TextAreaProps) => {
    const defaultClass = {
        'large': 'block w-full p-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'base': 'block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'small': 'block w-full p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
    };
    const hintClass = {
        true: 'mt-2 text-sm text-red-600 dark:text-red-500',
        false: 'mt-2 text-sm text-green-600 dark:text-green-500',
        'default': 'mt-2 text-sm text-gray-500 dark:text-gray-400'
    }

    return (
        <div class={props?.containerClass ?? ` mb-4`}>

            <Show when={!!props?.label}>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props?.label}
                </label>
            </Show>


            <Show when={props?.disabled === true} fallback={
                <textarea
                    onInput={async (e) => {
                        if (props?.onInput)
                            await props?.onInput(e.target.value, e);
                    }}
                    onChange={async (e) => {
                        if (props?.onChange)
                            await props?.onChange(e.target.value, e);
                    }}
                    onKeyUp={async (e) => {
                        if (props?.onKeyUp)
                            await props?.onKeyUp(e.key, e.target.value, e);
                    }}
                    maxlength={props?.maxlength ?? ''}
                    minlength={props?.minlength ?? ''}
                    placeholder={props?.placeholder ?? ''}
                    class={props?.class ?? defaultClass[props?.size ?? 'base']}

                >{props?.value ?? ''}</textarea>
            }>
                    <textarea
                        onInput={async (e) => {
                            if (props?.onInput)
                                await props?.onInput(e.target.value, e);
                        }}
                        onChange={async (e) => {
                            if (props?.onChange)
                                await props?.onChange(e.target.value, e);
                        }}
                        onKeyUp={async (e) => {
                            if (props?.onKeyUp)
                                await props?.onKeyUp(e.key, e.target.value, e);
                        }}
                        maxlength={props?.maxlength ?? ''}
                        minlength={props?.minlength ?? ''}
                        placeholder={props?.placeholder ?? ''}
                        class={props?.class ?? defaultClass[props?.size ?? 'base']}
                        value={props?.value ?? ''}
                    >{props?.value ?? ''}</textarea>
            </Show>


            <Show when={!!props?.hintText} fallback={
                <Show when={!!props?.error?.text}>
                    <p class={hintClass[props?.error?.has ?? true]}>
                        {props?.error?.text ?? ''}
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

export default TextArea;