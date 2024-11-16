import {Component, createSignal, JSX, Setter, Show} from "solid-js";
import Lang from "../../Core/Helper/Lang";

export interface ButtonProps {
    children?: JSX.Element,
    disabled?: boolean,
    onClick?: (setLoading: Setter<boolean>) => boolean | void,
    loadingText?: JSX.Element,
    class?: string,
    'data-popover-target'?:string,
    onMouseOver : (e :  MouseEvent & {currentTarget: HTMLButtonElement, target: Element}) => any,
    onMouseLeave : (e :  MouseEvent & {currentTarget: HTMLButtonElement, target: Element}) => any,

}


const Button: Component<ButtonProps> = (props?: ButtonProps) => {
    const [loading, setLoading] = createSignal(false);
    const onClick = async () => {
        if (!loading() && props?.onClick)
            await props.onClick(setLoading);
    }
    const defaultClass = "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
    return (
        <>
            <Show when={!!props?.["data-popover-target"]} fallback={
                <Show when={props?.disabled} fallback={
                    <button
                        onMouseOver={async (e) => {
                            if(props?.onMouseOver)
                                await props.onMouseOver(e);
                        }}
                        onMouseLeave={async (e) => {
                            if(props?.onMouseLeave)
                                await props.onMouseLeave(e);
                        }}
                        onClick={onClick}
                        class={props?.class ?? defaultClass}>
                        <Show when={loading()} fallback={props?.children}>
                            {props?.loadingText ?? Lang.get('component.button.loading')}
                        </Show>
                    </button>
                }>
                    <button
                        onMouseOver={async (e) => {
                            if(props?.onMouseOver)
                                await props.onMouseOver(e);
                        }}
                        onMouseLeave={async (e) => {
                            if(props?.onMouseLeave)
                                await props.onMouseLeave(e);
                        }}
                        onClick={onClick}
                        class={props?.class ?? defaultClass}
                        disabled>
                        <Show when={loading()} fallback={props?.children}>
                            {props?.loadingText ?? Lang.get('component.button.loading')}
                        </Show>
                    </button>
                </Show>
            }>
                <Show when={props?.disabled} fallback={
                    <button
                        onMouseOver={async (e) => {
                            if(props?.onMouseOver)
                                await props.onMouseOver(e);
                        }}
                        onMouseLeave={async (e) => {
                            if(props?.onMouseLeave)
                                await props.onMouseLeave(e);
                        }}
                        data-popover-target={props?.["data-popover-target"]}
                        onClick={onClick}
                        class={props?.class ?? defaultClass}>
                        <Show when={loading()} fallback={props?.children}>
                            {props?.loadingText ?? Lang.get('component.button.loading')}
                        </Show>
                    </button>
                }>
                    <button
                        onMouseOver={async (e) => {
                            if(props?.onMouseOver)
                                await props.onMouseOver(e);
                        }}
                        onMouseLeave={async (e) => {
                            if(props?.onMouseLeave)
                                await props.onMouseLeave(e);
                        }}
                        data-popover-target={props?.["data-popover-target"]}
                        onClick={onClick}
                        class={props?.class ?? defaultClass}
                        disabled>
                        <Show when={loading()} fallback={props?.children}>
                            {props?.loadingText ?? Lang.get('component.button.loading')}
                        </Show>
                    </button>
                </Show>
            </Show>

        </>
    );
}
export default Button;