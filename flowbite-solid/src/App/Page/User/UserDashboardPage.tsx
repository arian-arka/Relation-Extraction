import {Component, createSignal} from "solid-js";
import UserApi, {IUser} from "../../Api/User.api";
import {useHelper} from "../../../Core/Helper/Helper";
import Str from "../../../Core/Helper/Str";
import LoadingShell from "../../../Component/Loading/LoadingShell";
import Lang from "../../../Core/Helper/Lang";
import ReportApi, {IEntitiesCountResponse} from "../../Api/Report.api";

const UserDashboardPage: Component = () => {
    const [user, setUser] = createSignal<undefined | IUser>(undefined, {equals: false});
    const [entitiesCount,setEntitiesCount] = createSignal<IEntitiesCountResponse|undefined>(undefined,{equals:false});

    const helper = useHelper();
    const idUser = Str.random();

    setUser(helper.storage.get('user', undefined));

    helper.storage.subscribe(idUser, (all, key, oldVal, newVal) => {
        if (key === user)
            setUser(newVal);
    });

    const fetchEntitiesCount = async () => {
        try {
            const result = await new ReportApi().entitiesCount();
            setEntitiesCount(result.props.data);
            console.log('result', result);
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }
    fetchEntitiesCount();

    return (<>
        <div class="shadow-md rounded-lg bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1  gap-4">
            <LoadingShell loading={!user()}>
                <figure class="max-w-screen-md mx-auto text-center">
                    <svg class="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                        <path
                            d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
                    </svg>
                    <blockquote>
                        <p class="text-2xl italic font-medium text-gray-900 dark:text-white">"{user()?.name ?? ''}"</p>
                    </blockquote>
                    <figcaption class="flex items-center justify-center mt-6 space-x-3">
                        {/*<img class="w-6 h-6 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" alt="profile picture">*/}
                        <div class="flex items-center ">
                            <cite class="pr-3 font-medium text-gray-900 dark:text-white">{user()?.email ?? ''}</cite>
                            <cite class="mx-1"> | </cite>
                            <cite class="pl-3 text-sm text-gray-500 dark:text-gray-400">{
                                Lang.get('datetime.fullDatetime',new Date(user()?.createdAt))
                            }</cite>
                        </div>
                    </figcaption>
                </figure>
            </LoadingShell>
            <LoadingShell loading={!entitiesCount()}>
            <section class="">
                <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
                    <dl class="grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
                        <div class="flex flex-col items-center justify-center">
                            <dt class="mb-2 text-3xl md:text-4xl font-extrabold">{entitiesCount()?.sentences}</dt>
                            <dd class="font-light text-gray-500 dark:text-gray-400">{Lang.get('words.sentences')}</dd>
                        </div>
                        <div class="flex flex-col items-center justify-center">
                            <dt class="mb-2 text-3xl md:text-4xl font-extrabold">{entitiesCount()?.relations}</dt>
                            <dd class="font-light text-gray-500 dark:text-gray-400">{Lang.get('words.relations')}</dd>
                        </div>
                        <div class="flex flex-col items-center justify-center">
                            <dt class="mb-2 text-3xl md:text-4xl font-extrabold">{entitiesCount()?.users}</dt>
                            <dd class="font-light text-gray-500 dark:text-gray-400">{Lang.get('words.users')}</dd>
                        </div>
                    </dl>
                </div>
            </section>
            </LoadingShell>
        </div>

    </>);
}
export default UserDashboardPage;