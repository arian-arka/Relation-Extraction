import {Component, createEffect, createSignal, For, JSX, Setter, Show} from "solid-js";

export interface CheckboxInputProps {
    label: string,
    onChange?: (value: boolean,setLoading:Setter<boolean>, e?: any) => boolean | void,
    disabled?: boolean,
    hintText?: string,
    error?: {
        text: string,
        has?: boolean
    },
    class?: string,
    containerClass?: string,
    checked?: boolean,
    loading?: boolean,
}


const CheckboxInput: Component<CheckboxInputProps> = (props?: CheckboxInputProps) => {
    const [loading,setLoading] = createSignal(false);
    createEffect(() => setLoading(props?.loading ?? false));
    const defaultClass = "ml-2 text-sm font-medium text-gray-900 dark:text-gray-300";
    const hintClass = {
        true: 'mt-2 text-sm text-red-600 dark:text-red-500',
        false: 'mt-2 text-sm text-green-600 dark:text-green-500',
        'default': 'mt-2 text-sm text-gray-500 dark:text-gray-400'
    }

    const onChange = async (value: boolean, e: Event & {
        currentTarget: HTMLInputElement,
        target: HTMLInputElement
    }) => {
        if (props?.onChange) {
            await props.onChange(value, setLoading,e);
        }
    }

    return (
        <>
            <Show when={loading()} fallback={
                <div class={props?.containerClass ?? `flex items-center mb-4`}>

                    <Show when={props?.disabled === true} fallback={
                        <Show when={props?.checked === true} fallback={
                            <>
                                <input type="checkbox" onChange={async (e) => await onChange(e.target.checked, e)}
                                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label
                                    class={props?.class ?? defaultClass}>{props?.label}</label>
                            </>
                        }>
                            <>
                                <input type="checkbox" checked
                                       onChange={async (e) => await onChange(e.target.checked, e)}
                                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label
                                    class={props?.class ?? defaultClass}>{props?.label}</label>
                            </>
                        </Show>

                    }>
                        <Show when={props?.checked === true} fallback={
                            <>
                                <input disabled type="checkbox"
                                       onChange={async (e) => await onChange(e.target.checked, e)}
                                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label
                                    class={props?.class ?? defaultClass}>{props?.label}</label>
                            </>
                        }>
                            <>
                                <input disabled checked type="checkbox"
                                       onChange={async (e) => await onChange(e.target.checked, e)}
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
            }>
                <div role="status">
                    <svg aria-hidden="true" class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </Show>
        </>
    );
}

export default CheckboxInput;