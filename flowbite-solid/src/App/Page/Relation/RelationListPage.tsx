import {Component, createEffect, createSignal, For, Show} from "solid-js";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import Table from "../../../Component/Table/Table";
import {A} from "@solidjs/router";
import Url from "../../../Core/Helper/Url";
import TableHeader from "../../../Component/Table/TableHeader";
import TableFilterList from "../../../Component/Table/TableFilterList";
import TextInput from "../../../Component/Input/TextInput";
import TableLimit from "../../../Component/Table/TableLimit";
import RelationApi, {IRelationListRequest, IRelationListResponse} from "../../Api/Relation.api";
import Lang from "../../../Core/Helper/Lang";

const RelationListPage: Component = () => {
    const helper = useHelper();

    const filters = new DataObject<IRelationListRequest>({
        page: helper.url.query('page', 1),
        linkPerPage: helper.url.query('linkPerPage', 5),
        limit: helper.url.query('limit', 50),
        name: helper.url.query('name', ''),
    });

    const [list, setList] = createSignal<IRelationListResponse | undefined>(undefined, {equals: false})

    const fetchList = async () => {
        try {
            console.log(filters.all());
            const result = await (new RelationApi()).list(filters.all());
            console.log('result', result);
            setList(result.props.data);
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }

    createEffect(async () => {
        helper.url.setQuery(filters.all());
        console.log('all filters',filters.all());
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
                           text: Lang.get('words.name')
                       },
                       {
                           key: 'description',
                           tdClass: 'px-4 py-3 text-center',
                           thClass: 'px-4 py-3 text-center',
                           text: Lang.get('words.description')
                       },
                       {
                           key: 'taggedCount',
                           tdClass: 'px-4 py-3 text-center',
                           thClass: 'px-4 py-3 text-center',
                           text: Lang.get('words.taggedCount')
                       },
                       {
                           key: 'action',
                           tdClass: 'px-4 py-3 text-center',
                           thClass: 'px-4 py-3 text-center',
                           text: Lang.get('words.action'),
                           value: (val, row) => {
                               return (
                                   <>
                                       <A target="_blank" href={`${Url.front('sentenceList')}?relation=${row._id}&relationName=${row.name}`}
                                          class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 inactive"
                                       >
                                           <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.583 5.445h.01M8.86 16.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 10.31 1l5.734.007A1.968 1.968 0 0 1 18 2.983v5.5a.994.994 0 0 1-.316.727l-7.439 7.5a.975.975 0 0 1-1.385.001Z"></path></svg>

                                       </A>
                                       <A href={`${Url.front('relationUpdate', row._id)}`}
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
                                           label={Lang.get('words.relation')}
                                           value={`${filters.all()?.name ?? ''}`}
                                           placeholder={Lang.get('placeholders.name')}
                                           onChange={async (val: string) => {
                                               filters.setKey('name', val);
                                           }}
                                       />
                                   </div>
                                   <div
                                       class="w-full basis-full lg:basis-1/4 md:basis-1/2 sm:basis-full grid grid-cols-2 gap-4">
                                       <TableLimit default={parseInt(filters.all().limit)} onLimit={async (limit) => {
                                           filters.merge({
                                               limit: `${limit}`,
                                               page: '1',
                                           });
                                       }}/>

                                       <A href={Url.front('relationStore')}
                                          class="w-full justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                       >
                                           <svg class="w-4 h-4 mr-2.5 text-white dark:text-white" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                                                viewBox="0 0 20 20">
                                               <path stroke="currentColor" stroke-linecap="round"
                                                     stroke-linejoin="round" stroke-width="2"
                                                     d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
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
                               keys={['name']}
                           />
                       </>
                   }
            />
        </>
    );
}

export default RelationListPage;