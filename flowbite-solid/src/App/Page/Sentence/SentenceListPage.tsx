import {Component, createEffect, createSignal, For, onCleanup, onMount, Show} from "solid-js";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import Table from "../../../Component/Table/Table";
import {A} from "@solidjs/router";
import Url from "../../../Core/Helper/Url";
import TableHeader from "../../../Component/Table/TableHeader";
import TableFilterList from "../../../Component/Table/TableFilterList";
import TextInput from "../../../Component/Input/TextInput";
import TableLimit from "../../../Component/Table/TableLimit";
import SentenceApi, {ISentenceListRequest, ISentenceListResponse} from "../../Api/Sentence.api";
import Sentence from "../../Component/Sentence";
import {usePrompt} from "../../../Core/Helper/Prompt";
import Lang from "../../../Core/Helper/Lang";
import TextWithDropDownInput from "../../../Component/Input/TextWithDropDownInput";
import UserApi, {IUserListResponse} from "../../Api/User.api";
import RelationApi, {IRelationListResponse} from "../../Api/Relation.api";
import SelectInput from "../../../Component/Input/SelectInput";
import {SENTENCE_STATUS} from "../../Constants";


const SentenceListPage: Component = () => {
    const prompt = usePrompt();

    const helper = useHelper();

    const filters = new DataObject<ISentenceListRequest>({
        words: helper.url.query('words', ''),
        relation: helper.url.query('relation', ''),
        user: helper.url.query('user', ''),
        username: helper.url.query('username', ''),
        relation: helper.url.query('relation', ''),
        relationName: helper.url.query('relationName', ''),
        status: helper.url.query('status', ''),
        statusName: helper.url.query('statusName', ''),
        hasRelation: helper.url.query('hasRelation', ''),
        linkPerPage: helper.url.query('linkPerPage', 5),
        limit: helper.url.query('limit', 10),
        page: helper.url.query('page', 1),
    });

    const [list, setList] = createSignal<ISentenceListResponse | undefined>(undefined, {equals: false})

    const [users, setUsers] = createSignal<IUserListResponse | undefined>(undefined, {equals: false});

    const [relations, setRelations] = createSignal<IRelationListResponse | undefined>(undefined, {equals: false});

    const fetchList = async () => {
        try {
            const data = {
                ...filters.filterKeys(['username', 'relationName'], false),
                hasRelation: filters.get('hasRelation') ? (filters.get('hasRelation') === Lang.get('words.withRelations') ? 'true' : 'false') : undefined,
            };
            if (data?.hasRelation === undefined)
                delete data.hasRelation;
            const result = await (new SentenceApi()).list(data);
            console.log('result', result);
            setList(result.props.data);
        } catch (e) {
            console.log('e', e);
        }
    }

    const fetchUsers = async (nameOrEmail: string) => {
        setUsers(undefined);
        try {
            console.log(filters.all());
            const result = await (new UserApi()).list({
                page: 1,
                linkPerPage: 1,
                nameOrEmail,
                limit: 500,
            });
            console.log('result', result);
            setUsers(result.props.data);
        } catch (e) {
            console.log('e', e);
        }
    }

    const fetchRelations = async (name: string) => {
        setUsers(undefined);
        try {
            console.log(filters.all());
            const result = await (new RelationApi()).list({
                page: 1,
                linkPerPage: 1,
                name,
                limit: 500,
            });
            console.log('result', result);
            setRelations(result.props.data);
        } catch (e) {
            console.log('e', e);
        }
    }

    createEffect(async () => {
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log(filters.all());
        helper.url.setQuery(filters.all());
        await fetchList();
    })

    return (
        <div>
            <Table rows={list()?.data ?? []}
                   onPage={(page) => {
                       filters.setKey('page', page);
                       document.body.scrollTop = 0;
                       document.documentElement.scrollTop = 0;
                   }}
                   columns={[
                       {
                           key: 'words',
                           tdClass: 'px-4 py-3 my-20 border-2 border-gray-200',
                           thClass: 'px-4 py-3 text-center',
                           text: Lang.get('words.sentence'),
                           value: (val, row) => {
                               return (
                                   <div class="my-12 ">
                                       <Sentence sentence={row}/>
                                   </div>
                               );
                           }
                       },
                       {
                           key: 'user',
                           tdClass: 'px-4 py-3 text-center border-2 border-gray-200',
                           thClass: 'px-4 py-3 text-center',
                           text: Lang.get('words.user'),
                           value: (val, row) => {
                               return val?.name ?? '-';
                           }
                       },
                   ]}
                   pagination={list()?.pagination ?? undefined}
                   header={
                       <div class="mt-20">
                           <TableHeader>
                               <div
                                   class="space-x-3 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">

                                   <div class="w-full basis-full lg:basis-3/4 md:basis-1/2 sm:basis-full mx-2">
                                       <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                           <TextInput
                                               icon={
                                                   <svg aria-hidden="true"
                                                        class="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                        fill="currentColor" viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                       <path fill-rule="evenodd"
                                                             d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                             clip-rule="evenodd"></path>
                                                   </svg>
                                               }
                                               type="text"
                                               label={'Sentence'}
                                               value={filters.all().words}
                                               placeholder={'sentence ...'}
                                               onChange={async (val: string) => {
                                                   filters.setKey('words', val);
                                                   filters.setKey('page', '1');
                                               }}
                                           />
                                           <TextWithDropDownInput
                                               clear={!(!!filters.all().user)}
                                               label={'users'}
                                               multipleSelection={false}
                                               onSelection={(selecteds) => {
                                                   console.log(selecteds);
                                                   if (selecteds) {
                                                       filters.setKey('username', selecteds.other.name);
                                                       filters.setKey('user', selecteds.other._id);
                                                   } else {
                                                       filters.setKey('username', '');
                                                       filters.setKey('user', '');
                                                   }
                                                   filters.setKey('page', '1');
                                               }}
                                               onInput={(value, e) => {
                                                   setTimeout(() => fetchUsers(value), 200);
                                               }}
                                               items={users()?.data.map((el) => ({
                                                   text: el.name,
                                                   other: el,
                                               })) ?? []}
                                           />
                                       </div>
                                   </div>
                                   <div
                                       class="w-full basis-full lg:basis-1/4 md:basis-1/2 sm:basis-full grid grid-cols-2 gap-4">
                                       <A href={Url.front('sentenceStore')}
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
                                       <TableLimit default={parseInt(filters.all().limit)}
                                                   onLimit={async (limit) => {
                                                       filters.setKey('limit', `${limit}`);
                                                       filters.setKey('page', '1');
                                                   }}/>
                                   </div>

                               </div>
                               <div
                                   class="space-x-3 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">

                                   <div class="w-full basis-full lg:basis-3/4 md:basis-1/2 sm:basis-full mx-2">
                                       <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                           <TextWithDropDownInput
                                               clear={!(!!filters.all().relation)}
                                               label={'relation'}
                                               multipleSelection={false}
                                               onSelection={(selecteds) => {
                                                   console.log(selecteds);
                                                   if (selecteds) {
                                                       filters.merge({
                                                           'relationName': selecteds.other.name,
                                                           'relation': selecteds.other._id,
                                                           'page': 1,
                                                       })
                                                   } else {
                                                       filters.merge({
                                                           'relationName': '',
                                                           'relation': '',
                                                           'page': 1,
                                                       })
                                                   }
                                               }}
                                               onInput={(value, e) => {
                                                   setTimeout(() => fetchRelations(value), 200);
                                               }}
                                               items={relations()?.data.map((el) => ({
                                                   text: el.name,
                                                   other: el,
                                               })) ?? []}
                                           />
                                           <SelectInput label={'has relation'}
                                                        value={''}
                                                        onChange={(val) => {
                                                            filters.merge({
                                                                'hasRelation': !!val ? val : '',
                                                                'page': '1'
                                                            })
                                                        }}
                                                        options={[
                                                            {
                                                                text: '',
                                                                value: '',
                                                            },
                                                            {
                                                                text: Lang.get('words.withRelations'),
                                                                value: Lang.get('words.withRelations'),
                                                            },
                                                            {
                                                                text: Lang.get('words.withoutRelations'),
                                                                value: Lang.get('words.withoutRelations'),
                                                            }
                                                        ]}/>
                                           <SelectInput label={'status'}
                                                        value={`${filters.all()?.status ?? ''}`}
                                                        onChange={(val) => {

                                                            if (!!val) {
                                                                filters.merge({
                                                                    'statusName': Lang.get(`sentence.status.${Object.keys(SENTENCE_STATUS)[Object.values(SENTENCE_STATUS).indexOf(parseInt(val))]}`),
                                                                    'status': val,
                                                                    'page': '1'
                                                                });
                                                            } else {
                                                                filters.merge({
                                                                    'statusName': '',
                                                                    'status': '',
                                                                    'page': '1'
                                                                });
                                                            }
                                                        }}
                                                        options={[
                                                            {
                                                                text: '',
                                                                value: '',
                                                            }, ...
                                                                Object.keys(SENTENCE_STATUS).map((key) => ({
                                                                    text: Lang.get(`sentence.status.${key}`),
                                                                    value: `${SENTENCE_STATUS[key]}`,
                                                                }))
                                                        ]
                                                        }/>
                                       </div>
                                   </div>
                               </div>
                           </TableHeader>
                           <TableFilterList
                               onDelete={async (key) => {
                                   const _ = {};
                                   if (key === 'username')
                                       _['user'] = '';
                                   if (key === 'relationName')
                                       _['relation'] = '';
                                   if (key === 'statusName')
                                       _['status'] = '';
                                   _[key] = ''
                                   filters.merge(_);
                               }}
                               data={filters.all()}
                               keys={['words', 'user', 'username', 'relation', 'relationName', 'hasRelation', 'status', 'statusName']}
                               dontShow={['user', 'relation', 'status']}
                           />
                       </div>
                   }
            />
        </div>
    );
}

export default SentenceListPage;