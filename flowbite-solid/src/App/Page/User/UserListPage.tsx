import {Component, createEffect, createSignal, For, Show} from "solid-js";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import UserApi, {IUserListRequest, IUserListResponse} from "../../Api/User.api";
import Table from "../../../Component/Table/Table";
import {A} from "@solidjs/router";
import Url from "../../../Core/Helper/Url";
import TableHeader from "../../../Component/Table/TableHeader";
import TableHeaderFilter from "../../../Component/Table/TableHeaderFilter";
import TableFilterList from "../../../Component/Table/TableFilterList";
import TextInput from "../../../Component/Input/TextInput";
import {TABLE_LIMITS} from "../../Constants";
import TableLimit from "../../../Component/Table/TableLimit";
import Lang from "../../../Core/Helper/Lang";

const UserListPage: Component = () => {
    const helper = useHelper();
    const filters = new DataObject<IUserListRequest>({
        page: helper.url.query('page', 1),
        linkPerPage: helper.url.query('linkPerPage', 5),
        limit: helper.url.query('limit', 50),
        nameOrEmail: helper.url.query('nameOrEmail', ''),
    });
    const [list, setList] = createSignal<IUserListResponse | undefined>(undefined, {equals: false})

    const fetchList = async () => {
        try {
            console.log(filters.all());
            const result = await (new UserApi()).list(filters.all());
            console.log('result', result);
            setList(result.props.data);
        } catch (e) {
            console.log('e', e);
        }
    }

    createEffect(async () => {

        helper.url.setQuery(filters.all());
        await fetchList();
    })

    return (
        <>
            <Table rows={list()?.data ?? []}
                   onPage={(page) => filters.setKey('page', page)}
                   columns={[
                       {
                           key: 'name',
                           tdClass: 'px-4 py-3 text-center',
                           thClass: 'px-4 py-3 text-center',
                           text : Lang.get('words.name')
                       },
                       {
                           key: 'email',
                           tdClass: 'px-4 py-3 text-center',
                           thClass: 'px-4 py-3 text-center',
                           text : Lang.get('words.email')
                       },
                       {
                           key: 'action',
                           tdClass: 'px-4 py-3 text-center',
                           thClass: 'px-4 py-3 text-center',
                           text : Lang.get('words.action'),
                           value: (val, row) => {
                               return (
                                   <>
                                       <A href={`${Url.front('userUpdate', row._id)}`}
                                          class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 inactive"
                                       >
                                           <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
                                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true">
                                               <path stroke-linecap="round" stroke-linejoin="round"
                                                     d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                                           </svg>
                                       </A>
                                   </>
                               );
                           }
                       },
                   ]}
                   pagination={list()?.pagination ?? undefined}
                   header={
                       <>
                           <TableHeader>
                               <div
                                   class="space-x-3 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">

                                   <div class="w-full basis-full lg:basis-3/4 md:basis-1/2 sm:basis-full mx-2">
                                       <TextInput
                                           icon={
                                               <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                    fill="currentColor" viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                   <path fill-rule="evenodd"
                                                         d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                         clip-rule="evenodd"></path>
                                               </svg>
                                           }
                                           type="text"
                                           label={Lang.get('words.user')}
                                           value={filters.all()?.nameOrEmail ?? ''}
                                           placeholder={Lang.get('placeholders.nameOrEmail')}
                                           onChange={(val: string) => filters.setKey('nameOrEmail', val)}
                                       />
                                   </div>
                                   <div
                                       class="w-full basis-full lg:basis-1/4 md:basis-1/2 sm:basis-full grid grid-cols-2 gap-4">

                                       <TableLimit default={parseInt(filters.all().limit)}
                                                   onLimit={async (limit) => {
                                                       filters.merge({
                                                           limit :  `${limit}`,
                                                           page : '1',
                                                       });
                                                   }}/>
                                       <A href={Url.front('userStore')} class="w-full justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                       >
                                           <svg class="w-4 h-4 mx-2 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                               <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                           </svg>
                                           {Lang.get('words.create')}
                                       </A>
                                   </div>
                               </div>
                           </TableHeader>
                           <TableFilterList
                               onDelete={async (key) => {
                                   filters.setKey(key, '');
                               }}
                               data={filters.all()}
                               keys={['nameOrEmail']}
                           />
                       </>
                   }
            />
        </>
    );
}

export default UserListPage;