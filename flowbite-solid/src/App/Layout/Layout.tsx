import {Component, createSignal, onCleanup} from "solid-js";
import {A, Outlet} from "@solidjs/router";
import TopNav, {TopNavProps} from "../../Component/Nav/TopNav";
import AsideItem from "../../Component/Nav/AsideItem";
import {useHelper} from "../../Core/Helper/Helper";
import Str from "../../Core/Helper/Str";
import UserApi from "../Api/User.api";
import Response from "../../Core/Class/Response";
import TopNavApps from "../Component/TopNavApps";
import Html from "../../Core/Helper/Html";
import Config from "../Config";
import AsideItems from "../Component/AsideItems";
import Lang from "../../Core/Helper/Lang";

const Layout: Component = () => {
    const helper = useHelper();
    const idUser = Str.random();
    const idLang = Str.random();

    const fetchLogout = async () => {
        try {
            await new UserApi().logout();
            helper.storage.unset('user');
            helper.storage.set('authenticated', '0');
        } catch (e) {
            const r: Response = e;
            if (r.is('unauthorized')) {
                helper.storage.unset('user');
                helper.storage.set('authenticated', '0');
                // helper.route('userLogin');
            }
        }
    }

    const [profile, setProfile] = createSignal<TopNavProps['profile']>({
        name: helper.storage.get('user')?.name ?? '',
        email: helper.storage.get('user')?.email ?? '',
        items: [
            <>
                <ul class="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                    <li>
                        <A href="/user/profile"
                           class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white inactive">
                            {Lang.get('words.profile')}
                        </A>
                    </li>
                </ul>
            </>,
            <>
                <ul class="py-1 font-light text-gray-500 dark:text-gray-400" aria-labelledby="dropdown">
                    <li>
                        <button onClick={fetchLogout}
                                class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg class="mr-2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5"
                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path>
                            </svg>
                            {Lang.get('words.logout')}
                        </button>
                    </li>
                </ul>
            </>,
        ]
    }, {equals: false});

    document.body.classList.add('antialiased', 'bg-gray-50', 'dark:bg-gray-900');

    helper.storage.subscribe(idUser, (all, key, oldValue, newValue) => {
        if (key === 'user') {
            const _ = profile();
            _['name'] = newValue?.name ?? null;
            _['email'] = newValue?.email ?? null;
            setProfile(_);
        }
    })

    helper.storage.subscribe(idLang,(all, key, oldValue, newValue) => {
        if(key === 'lang')
            location.reload();
    })

    const fetchUser = async () => {
        try {
            const result = await new UserApi().self();
            helper.storage.set('user',result.props.data);
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }

    fetchUser();

    onCleanup(() => {
        document.body.classList.remove('antialiased', 'bg-gray-50', 'dark:bg-gray-900');
        helper.storage.unsubscribe(idUser);
    });

    return (
        <div>
            <TopNav aside={
                <>
                    <AsideItem
                        items={AsideItems({})}
                    />
                </>
            } apps={TopNavApps} profile={{...profile()}}/>

            <main class=" p-1  h-auto pt-5">
                <Outlet/>
            </main>

        </div>
    );

}

export default Layout;

