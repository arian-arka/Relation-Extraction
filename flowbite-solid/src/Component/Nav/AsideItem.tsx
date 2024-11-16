import {A} from "@solidjs/router";
import {Component, createEffect, createSignal, For, JSX, Show} from "solid-js";
import {useHelper} from "../../Core/Helper/Helper";

export interface IAsideItem {
    text: string | JSX.Element,
    link?: string,
    open?: boolean,
    children?: IAsideItem[],
}

const AsideItems: Component<{ items?: (IAsideItem[])[] }> = (props) => {
    const [items, setItems] = createSignal<(IAsideItem[])[]>(props?.items ?? [], {equals: false});
    const helper = useHelper();
    // createEffect(()=>setItems(props?.items ?? []));
    const dir = helper.storage.get('dir','ltr') === 'ltr' ? 'left' : 'right';

    const generate = (_items: IAsideItem[], index = 0) => {
        if (_items.length > 0)
            return (
                <>
                    <ul style={`padding-${dir}:${index * 10}px; `}
                        class={`${index ? 'pb-1 mb-1' : 'border-b pb-5 mb-5'} space-y-2  border-gray-200 dark:border-gray-700`}>
                        <For each={_items}>{(item) =>
                            <Show when={item?.children?.length > 0} fallback={
                                <li>
                                    <A href={item.link ?? '#'}
                                       class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                        {item.text}
                                    </A>
                                </li>
                            }>
                                <li>
                                    <button onClick={() => {
                                        item.open = !(item.open === true);
                                        setItems(items());
                                        console.log(items());
                                    }} type="button"
                                            class="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                        {item.text}
                                        <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                  clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                    <Show when={item.open === true}>
                                        {generate(item.children ?? [], index + 1)}
                                    </Show>
                                </li>
                            </Show>
                        }</For>
                    </ul>
                </>
            );
        return (<></>);
    }

    const all = (_items?: (IAsideItem[])[]) => {
        return (
            <For each={_items ?? []}>
                {(i) => generate(i)}
            </For>
        );
    }

    return (
        <>{all(items())}</>
    );
}
export default AsideItems;