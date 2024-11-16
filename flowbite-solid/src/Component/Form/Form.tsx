import {Accessor, Component, createEffect, createSignal, For, JSX, Match, Setter, Show, Switch} from "solid-js";
import Button from "../Button/Button";
import TextInput from "../Input/TextInput";
import SelectInput from "../Input/SelectInput";
import CheckboxInput from "../Input/CheckboxInput";
import RadioInput from "../Input/RadioInput";

export type FormTextInputInterface = {
    containerClass?: string,
    label?: string,
    type: 'text' | 'password' | 'email' | 'number',
    disabled?: boolean,
    placeholder?: string,
    hintText?: string,
    icon?: JSX.Element,
    error?: {
        text: string,
        has?: boolean
    },
    minlength?: number,
    maxlength?: number,
    min?: number,
    max?: number,
    class?: string,
    size?: number,

    key: string,
    cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
    colSpan?: number,
}

export type FormSelectInputInterface = {
    containerClass?: string,
    label?: string,
    type: 'select',
    disabled?: boolean,
    hintText?: string,
    error?: {
        text: string,
        has?: boolean
    },
    class?: string,
    size?: 'small' | 'base' | 'large',
    options?: {
        value: any,
        text?: string,
    }[]

    key: string,
    cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
    colSpan?: number,
}

export type FormCheckboxInputInterface = {
    containerClass?: string,
    label?: string,
    type: 'checkbox',
    disabled?: boolean,
    hintText?: string,
    error?: {
        text: string,
        has?: boolean
    },
    class?: string,
    size?: 'small' | 'base' | 'large',
    checked?: boolean,

    key: string,
    cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
    colSpan?: number,
}

export type FormRadioInputInterface = {
    containerClass?: string,
    label?: string,
    type: 'radio',
    disabled?: boolean,
    hintText?: string,
    error?: {
        text: string,
        has?: boolean
    },
    class?: string,
    size?: 'small' | 'base' | 'large',
    checked?: boolean,
    value?: string,

    key: string,
    cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
    colSpan?: number,
}

export type CustomFormInputInterface = {
    type: 'custom',
    element: JSX.Element,
    subscribe: (onChange: (val: any) => void) => void

    key: string,
    cast?: 'string' | 'number' | 'bool' | 'boolean' | ((val: any) => any),
    colSpan?: number,
}

export type FormInputInterface = FormTextInputInterface | FormSelectInputInterface |
    FormCheckboxInputInterface | FormRadioInputInterface | CustomFormInputInterface;

export type FormInputInterfaceArray = FormInputInterface[];

export interface FormProps {
    errors?:Accessor<{ [key : string] : string }>,
    class?: string,
    inputs?: FormInputInterfaceArray,
    onEnter?: (data: any) => void | boolean,
    dataSetter?: Setter<any>,
    header?:string,
}

const Form: Component<FormProps> = (props?: FormProps) => {
    const data: { [key: string]: any } = {};
    const [errors,setErrors] = createSignal({},{equals:false});
    const setData = (key: string, value: any) => {
        data[key] = value;
        props?.dataSetter && props?.dataSetter(data);
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
                cast ? setData(key, cast(value)) : setData(key, value);
                break;
        }

    }

    const defaultClass = `p-4 w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`;

    const generateForm = (inputs?: FormInputInterfaceArray | FormInputInterface) => {
        if (Array.isArray(inputs) && !inputs?.length)
            return <></>;
        if (Array.isArray(inputs))
            return (<For each={inputs}>
                {(inp) => generateForm(inp)}
            </For>);

        switch (inputs?.type) {
            case 'custom':
                return (() => {
                    inputs?.subscribe(async (val: any) => await onChange(inputs?.key, val, inputs?.cast));
                    return inputs?.element;
                })();
            case 'radio':
                const tmpRadio = {
                    ...inputs,
                    'onChange': async (value: boolean) => {
                        await onChange(inputs.key, value, inputs.cast)
                    }
                }
                return <RadioInput {...tmpRadio}/>
            case 'checkbox':
                const tmpCheck = {
                    ...inputs,
                    'onChange': async (value: boolean) => {
                        await onChange(inputs.key, value, inputs.cast)
                    }
                }
                return <CheckboxInput {...tmpCheck}/>
            case 'select':
                const tmpSelect = {
                    ...inputs,
                    'onChange': async (value: boolean) => {
                        await onChange(inputs.key, value, inputs.cast)
                    }
                }
                return <SelectInput {...tmpSelect}/>
            default:
                const tmpText = {
                    ...inputs,
                    'onChange': async (value: boolean) => {
                        await onChange(inputs.key, value, inputs.cast)
                    }
                }
                return <TextInput {...tmpText}/>
        }
    }

    return (
        <>
            <div onKeyUp={async (e) => {
                if (e.key === 'Enter')
                    props?.onEnter && await props?.onEnter(data);
            }} class={!!props?.class ? props?.class : defaultClass}>
                <Show when={!!props?.header}>
                    <h1 class="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {props?.header ?? ''}
                    </h1>
                </Show>
                {props?.children}
                {generateForm(props?.inputs ?? [])}
            </div>
        </>
    );
}

export default Form;