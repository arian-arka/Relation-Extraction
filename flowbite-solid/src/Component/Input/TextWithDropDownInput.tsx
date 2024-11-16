import {Component, createEffect, createSignal, For, Show} from "solid-js";
import {DataArray} from "../../Core/Class/DataObject";
import Button from "../Button/Button";

export interface TextWithDropDownInputProps {
    showBadge?:boolean,
    value?: string,
    items?: ({
        text: string,
        other: any,
    })[],
    onChange?: (value: string, e: Event & {
        currentTarget: HTMLInputElement,
        target: HTMLInputElement
    }) => void,
    onInput?: (value: string, e: Event & {
        currentTarget: HTMLInputElement,
        target: HTMLInputElement
    }) => void,
    multipleSelection: boolean,
    onSelection: (value: any[] | any) => void,
    compare?: (obj1: any, obj2: any) => boolean,
    placeholder?: string,
    label?: string,
    show?: boolean,
    clear?:boolean,
}

const TextWithDropDownInput: Component<TextWithDropDownInputProps> = (props) => {
    const [value,setValue] = createSignal(props?.value ?? '');
    const selected = new DataArray([]);
    const [show, setShow] = createSignal(true);
    createEffect(() => setShow(props?.show ?? true));
    const onSelection = async () => {
        if (props?.onSelection) {
            if (props?.multipleSelection)
                await props.onSelection(selected.all());
            else
                await props.onSelection(selected.length() > 0 ? selected.at(0) : undefined);
        }
    }
    createEffect(() => {
        if(props?.clear === true){
            selected.clear();
            setValue('');
        }
    })
    return (
        <>
            <div class=" ">

                <Show when={!!props?.label}>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {props?.label}
                    </label>
                </Show>

                <div class="relative">
                    <div class="h-10 bg-white flex border border-gray-200 rounded items-center">
                        <input value={value() ?? ''} onChange={async (e) => {
                            if(props?.onChange){
                            await props.onChange(e.target.value, e);
                            setShow(true);}
                        }} onInput={async (e) => {
                            if(props?.onInput){
                            await props.onInput(e.target.value, e);
                            setShow(true);}
                        }} class="px-4 appearance-none outline-none text-gray-800 w-full"/>
                        <Show when={props?.showBadge === true && selected.all().length > 0}>
                                               <span id="badge-dismiss-default"
                                                     class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
  {selected.at(0).text}
                                                   <button onClick={async (setLoading) => {
                                                       selected.set([]);
                                                       await onSelection();
                                                       setShow(false);
                                                   }}
                                                           class="inline-flex items-center p-1 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                                                           data-dismiss-target="#badge-dismiss-default"
                                                           aria-label="Remove">
    <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
    <span class="sr-only">Remove badge</span>
  </button>
</span>
                        </Show>
                        <button
                            onClick={async (setLoading) => {
                                selected.set([]);
                                await onSelection();
                                setShow(false);
                                setValue('');

                            }}
                            class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600">
                            <svg class="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                    </div>
                    <Show when={show()}>
                        <Show when={props?.items?.length > 0}>
                            <div
                                class="h-32 md:w-1/2 w-full absolute flex rounded shadow bg-white overflow-hidden peer-checked:flex flex-col mt-1 border border-gray-200 overflow-y-scroll">
                                <For each={props?.items}>{(item) =>
                                    <div onClick={async () => {
                                        selected.set([item]);
                                        setValue(item.text);
                                        setShow(false);
                                        await onSelection();
                                    }} class="cursor-pointer group">
                                        <button
                                            class="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">
                                            {item.text}
                                        </button>
                                    </div>
                                }</For>
                            </div>
                        </Show>
                    </Show>
                </div>
            </div>
        </>
    );

    // return (<>
    //
    //     <div>
    //         <div class="">
    //             <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //                 {props?.label}
    //             </label>
    //             <div class="relative">
    //                 <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    //                     <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
    //                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    //                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    //                               d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
    //                     </svg>
    //                 </div>
    //                 <input type="text" value={props?.value ?? ''} onChange={async (e) => {
    //                     const value = e.target.value;
    //                     await props.onChange(value, e);
    //                 }}
    //                        class="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //                        placeholder={props?.placeholder ?? ''}/>
    //             </div>
    //         </div>
    //         <Show when={props?.items?.length > 0}>
    //             <div class="mx-auto py-2 w-auto md:w-1/2 z-10 bg-white rounded-lg shadow dark:bg-gray-700 block">
    //                 <ul class="h-min px-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
    //
    //                     <Show when={props?.multipleSelection ?? false} fallback={
    //                         <For each={props?.items}>{(item) =>
    //                             <li>
    //                                 <div onClick={async () => {
    //                                     selected.set([item]);
    //                                     await onSelection();
    //                                 }} class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
    //                                     <label
    //                                         class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
    //                                         {item.text}
    //                                     </label>
    //                                 </div>
    //                             </li>
    //                         }</For>
    //                     }>
    //                         <For each={props?.items}>{(item) =>
    //                             <li>
    //                                 <div onClick={async () => {
    //                                     let i = -1, found = false;
    //                                     for (let o of selected.all()) {
    //                                         i++;
    //                                         if (props.compare(o, item)) {
    //                                             selected.remove(i);
    //                                             found = true;
    //                                             break;
    //                                         }
    //                                     }
    //                                     if (!found)
    //                                         selected.push(item);
    //                                     await onSelection();
    //                                 }} class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
    //
    //                                     <input checked id="checkbox-item-12" type="checkbox" value=""
    //                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
    //
    //                                     <label
    //                                         class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
    //                                         {item.text}
    //
    //                                     </label>
    //                                 </div>
    //                             </li>
    //                         }</For>
    //                     </Show>
    //
    //                 </ul>
    //             </div>
    //         </Show>
    //     </div>
    //
    // </>);
}

export default TextWithDropDownInput;