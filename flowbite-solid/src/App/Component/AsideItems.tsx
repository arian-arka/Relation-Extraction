import {Component} from "solid-js";
import {useHelper} from "../../Core/Helper/Helper";
import Lang from "../../Core/Helper/Lang";
import Url from "../../Core/Helper/Url";

const AsideItems: Component = () => {
    const helper = useHelper();
    const spanMargin = helper.storage.get('dir', 'ltr') === 'ltr' ? 'ml-3' : 'text-start mr-3';
    return [

        [
            {
                text: <>
                    <svg
                        class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                              d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                    </svg>
                    <span
                        class={`flex-1 ${spanMargin} text-left whitespace-nowrap`}>{Lang.get('words.relations')}</span>
                </>,
                link: 'link1',
                children: [
                    {
                        text: 'ساخت',
                        link: Url.front('relationStore')
                    },
                    {
                        text: 'فهرست',
                        link: Url.front('relationList')
                    },
                ],
            },
            {
                text: <>
                    <svg
                        class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13.583 5.445h.01M8.86 16.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 10.31 1l5.734.007A1.968 1.968 0 0 1 18 2.983v5.5a.994.994 0 0 1-.316.727l-7.439 7.5a.975.975 0 0 1-1.385.001Z"></path>
                    </svg>
                    <span
                        class={`flex-1 ${spanMargin} text-left whitespace-nowrap`}>{Lang.get('words.sentences')}</span>
                </>,
                link: 'link1',
                children: [
                    {
                        text: 'ساخت',
                        link: Url.front('sentenceStore')
                    },
                    {
                        text: 'فهرست',
                        link: Url.front('sentenceList')
                    },
                ],
            },
        ],
        [
            {
                text: <>
                    <svg aria-hidden="true"
                         class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                         fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                    </svg>
                    <span class={`flex-1 ${spanMargin} text-left whitespace-nowrap`}>{Lang.get('words.users')}</span>
                </>,
                children: [
                    {
                        text: 'ساخت',
                        link: Url.front('userStore')
                    },
                    {
                        text: 'فهرست',
                        link: Url.front('userList')
                    },
                ],
            },
        ],
    ];
}
export default AsideItems;