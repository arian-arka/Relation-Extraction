import {Accessor, Component, createEffect, createSignal, JSX, Show} from "solid-js";
import {useHelper} from "../../Core/Helper/Helper";

export interface TextInputProps {
    label?: string,
    type?: 'text' | 'password' | 'email' | 'number',
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
    min?: number,
    max?: number,
    class?: string,
    containerClass?: string,
    size?: 'small' | 'base' | 'large',
    value?: string,
}


const TextInput: Component<TextInputProps> = (props?: TextInputProps) => {
    const [value,setValue] = createSignal("");
    createEffect(() => setValue(props?.value ?? ''));

    const defaultClass = {
        'large': 'block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'base': ' block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'small': 'block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
    };
    const hintClass = {
        true: 'mt-2 text-sm text-red-600 dark:text-red-500',
        false: 'mt-2 text-sm text-green-600 dark:text-green-500',
        'default': 'mt-2 text-sm text-gray-500 dark:text-gray-400'
    }
    const helper = useHelper();
    return (
        <div class={props?.containerClass ?? ` mb-4`}>

            <Show when={!!props?.label}>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props?.label}
                </label>
            </Show>

            <Show when={props?.icon} fallback={
                <Show when={props?.disabled === true} fallback={
                    <input
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
                        type={props?.type ?? 'text'}
                        maxlength={props?.maxlength ?? ''}
                        minlength={props?.minlength ?? ''}
                        min={props?.min ?? ''}
                        max={props?.max ?? ''}
                        placeholder={props?.placeholder ?? ''}
                        class={props?.class ?? defaultClass[props?.size ?? 'base']}
                        value={value()}
                    />
                }>
                    <input
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
                        type={props?.type ?? 'text'}
                        maxlength={props?.maxlength ?? ''}
                        minlength={props?.minlength ?? ''}
                        min={props?.min ?? ''}
                        max={props?.max ?? ''}
                        placeholder={props?.placeholder ?? ''}
                        class={props?.class ?? defaultClass[props?.size ?? 'base']}
                        value={value()}
                        disabled
                    />
                </Show>
            }>
                <div class="relative mb-6">
                    <div
                        class={`absolute inset-y-0 ${helper.storage.get('dir', 'ltr') === 'ltr' ? 'left-0 pl-3.5' : 'right-0 pr-3.5'} flex items-center  pointer-events-none`}>
                        {props?.icon}
                    </div>
                    <Show when={props?.disabled === true} fallback={
                        <input type={props?.type ?? 'text'}
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
                               min={props?.min ?? ''}
                               max={props?.max ?? ''}
                               value={value()}
                               placeholder={props?.placeholder ?? ''}
                               class={props?.class ?? `${defaultClass[props?.size ?? 'base']}  ${helper.storage.get('dir', 'ltr') === 'ltr' ? 'pl-10':  'pr-10 text-start'}`}
                        />
                    }>
                        <input type={props?.type ?? 'text'}
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
                               min={props?.min ?? ''}
                               max={props?.max ?? ''}
                               placeholder={props?.placeholder ?? ''}
                               value={value()}
                               class={props?.class ?? `${defaultClass[props?.size ?? 'base']} ${helper.storage.get('dir', 'ltr') === 'ltr' ?'pl-10': 'pr-10 text-start'}`}
                               disabled
                        />
                    </Show>
                </div>
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

export default TextInput;