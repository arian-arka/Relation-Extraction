import {A} from "@solidjs/router";
import Url from "../../Core/Helper/Url";
import {Component, createSignal} from "solid-js";
import {useHelper} from "../../Core/Helper/Helper";
import Str from "../../Core/Helper/Str";
import {USER_PRIVILEGES} from "../Constants";
import {usePrompt} from "../../Core/Helper/Prompt";
import Form from "../../Component/Form/Form";
import SelectInput from "../../Component/Input/SelectInput";
import Config from "../Config";
import Lang from "../../Core/Helper/Lang";

const apps: Component = () => {
    const prompt = usePrompt();

    const [privileges, setPrivileges] = createSignal<number[]>([], {equals: false});

    const helper = useHelper();

    const id = Str.random();

    helper.storage.subscribe(id, (all, key, oldValue, newValue) => {
        if (key === 'user')
            setPrivileges(newValue?.privileges ?? []);
    });

    const makeLanguagePrompt = () => {
        prompt.setSide({
            align:'right',
            header:'',
            children:<>
                <Form
                    header= {Lang.get('words.language')}
                    class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
                >
                    <SelectInput label="Relation type" value={helper.storage.get('lang','en')}  onChange={(val) => {
                        helper.storage.set('dir',Config.langDir[val]);
                        helper.storage.set('lang',val);
                    }}
                    options={[
                        {value : 'en'},
                        {value : 'fa'},
                    ]}/>

                </Form>
            </>
        });
    }



    return (
        <>
            <button onClick={makeLanguagePrompt}
                class={` block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group`}>
                <svg
                    class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                    fill="none" viewBox="0 0 21 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.487 1.746c0 4.192 3.592 1.66 4.592 5.754 0 .828 1 1.5 2 1.5s2-.672 2-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5m-16.02.471c4.02 2.248 1.776 4.216 4.878 5.645C10.18 13.61 9 19 9 19m9.366-6h-2.287a3 3 0 0 0-3 3v2m6-8a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <div class="text-sm text-gray-900 dark:text-white">{Lang.get('words.language')}</div>
            </button>
            <A href={Url.front('userList')}
               class={`${privileges()?.includes(USER_PRIVILEGES["view users"]) ? '' : 'hidden'} block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group`}>
                <svg aria-hidden="true"
                     class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
                <div class="text-sm text-gray-900 dark:text-white">{Lang.get('words.users')}</div>
            </A>
            <A href={Url.front('relationList')}
               class={`${privileges()?.includes(USER_PRIVILEGES["view relations"]) ? '' : 'hidden'} block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group`}>
                <svg
                    class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                          d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                </svg>
                <div class="text-sm text-gray-900 dark:text-white">{Lang.get('words.relations')}</div>
            </A>
            <A href={Url.front('sentenceList')}
               class={`${privileges()?.includes(USER_PRIVILEGES["view sentences"]) ? '' : 'hidden'} block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group`}>
                <svg
                    class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13.583 5.445h.01M8.86 16.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 10.31 1l5.734.007A1.968 1.968 0 0 1 18 2.983v5.5a.994.994 0 0 1-.316.727l-7.439 7.5a.975.975 0 0 1-1.385.001Z"/>
                </svg>
                <div class="text-sm text-gray-900 dark:text-white">{Lang.get('words.sentences')}</div>
            </A>

        </>
    );
}

export default apps;