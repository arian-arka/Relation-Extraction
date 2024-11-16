import {Component, createEffect, createSignal, For, JSX, Match, Setter, Show, Switch} from "solid-js";
import Button from "../Button/Button";
import TextInput from "../Input/TextInput";
import SelectInput from "../Input/SelectInput";
import CheckboxInput from "../Input/CheckboxInput";
import RadioInput from "../Input/RadioInput";
import Lang from "../../Core/Helper/Lang";

export interface LoginFormProps {
    header?: string | JSX.Element,
    heading?: string,
    footer?: string | JSX.Element,
    onLogin?: (setLoading: Setter<boolean>) => void | boolean,
    containerClass?: string,
}

const LoginForm: Component<LoginFormProps> = (props?: LoginFormProps) => {
    const [loading, setLoading] = createSignal(false);
    return (
        <>
            <section onKeyUp={async (e) => {
                if (e.key === 'Enter' && !loading())
                    await props?.onLogin(setLoading);
            }} class={props?.containerClass ?? `bg-gray-50 dark:bg-gray-900`}>
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                    <Show when={!!props?.header}>
                        {props?.header}
                    </Show>

                    <div
                        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                {props?.heading ?? ''}
                            </h1>
                            <div class="space-y-4 md:space-y-6">
                                {props?.children}
                                <Show when={loading()} fallback={
                                    <button
                                        class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        onClick={async () => {
                                            await props?.onLogin(setLoading);
                                        }}>
                                        {Lang.get('words.login')}
                                    </button>
                                }>
                                    <button
                                        class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                        {Lang.get('component.button.loading')}
                                    </button>
                                </Show>
                                {props?.footer ?? ''}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default LoginForm;