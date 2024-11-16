import {Component, createEffect, createSignal, For, Match, onCleanup, Setter, Show, Switch} from "solid-js";
import SentenceApi, {IFullSentenceResponse, ITagSentenceRequest} from "../Api/Sentence.api";
import Str from "../../Core/Helper/Str";
import Random from "../../Core/Helper/Random";
import {usePrompt} from "../../Core/Helper/Prompt";
import Button from "../../Component/Button/Button";
import DataObject, {DataArray} from "../../Core/Class/DataObject";
import LoadingShell from "../../Component/Loading/LoadingShell";
import {useHelper} from "../../Core/Helper/Helper";
import Form from "../../Component/Form/Form";
import TextInput from "../../Component/Input/TextInput";
import TextArea from "../../Component/Input/TextArea";
import SelectInput from "../../Component/Input/SelectInput";
import RelationApi, {IRelation} from "../Api/Relation.api";
import {SENTENCE_STATUS, USER_PRIVILEGES} from "../Constants";
import {Tooltip, TooltipOptions} from 'flowbite';
import {A} from "@solidjs/router";
import Url from "../../Core/Helper/Url";
import Lang from "../../Core/Helper/Lang";
import {useToast} from "../../Core/Helper/Toast";
import arrowLine from 'arrow-line'
// const arrowLine = require('arrow-line');
type IConvertedSentence = ({
    word: string,
    line?: boolean,
    entity?: boolean,
    draw?: {
        from: boolean,
        id: string,
        level: number
    },
})[];

type IDrawableConnections = ([
    {
        from: boolean,
        id: string,
        level: number
    },
    {
        from: boolean,
        id: string,
        level: number
    }
])[];

type IDrawableSentence = {
    words: string,
    entities: ({ start: number, end: number })[],
    relations: ({
        name: string,
        from: number,
        to: number,
    })[]
}

function unsecuredCopyToClipboard(text: string) {
    if(navigator.clipboard){
        navigator.clipboard.writeText(text)
        return //codes below wont be executed
    }
    const s = document.documentElement.scrollTop || document.body.scrollTop;
    const textArea = document.createElement("textarea")
    textArea.value = text

    document.body.appendChild(textArea)

    textArea.focus();
    textArea.select()

    document.execCommand('copy')

    document.body.removeChild(textArea);
    window.scroll({top : s,});
}

const Sentence: Component<{ sentence: IFullSentenceResponse }> = (props) => {
    let selectedEntities = [];

    const prompt = usePrompt();

    const helper = useHelper();

    let newRelation = [undefined, undefined, undefined];

    const selectedIndices = new DataArray<number>([]);

    const [relations, setRelations] = createSignal<undefined | IRelation[]>(undefined, {equals: false});

    const fetchRelations = async () => {
        try {
            const result = await (new RelationApi()).list({
                page: 1,
                linkPerPage: 1,
                limit: 500
            });
            setRelations(result.props.data.data.map(el => ({
                description: el.description ?? '',
                text: el.name,
                value: el._id,
            })));
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }

    fetchRelations();

    const [relationDescription, setRelationDescription] = createSignal("");

    const [sentence, setSentence] = createSignal<IFullSentenceResponse | undefined>(props?.sentence, {equals: false});

    const [convertedSentence, setConvertedSentence] = createSignal<IConvertedSentence | undefined>(undefined, {equals: false});

    const [connections, setConnections] = createSignal<undefined | IDrawableConnections>(undefined, {equals: false});

    const [shouldDraw, setShouldDraw] = createSignal(false);

    let lines = [];

    const toast = useToast();

    const isIndexEntity = (index: number) => {
        for (let e of sentence()?.entities ?? [])
            if (index >= e.start && index <= e.end)
                return true;
        return false;
    };

    const isIndexNearAnother = (index: number) => {
        const len = convertedSentence()?.length;

        if (convertedSentence()?.length < 2)
            return true;

        if (index == 0)
            return selectedIndices.has(index + 1);
        if (index + 1 === len)
            return selectedIndices.has(index - 1);

        return selectedIndices.has(index - 1) || selectedIndices.has(index + 1);
    };

    const isIndexInMiddle = (index: number) => {
        const len = convertedSentence()?.length;

        if (convertedSentence()?.length < 3)
            return false;

        return index === 0 || index + 1 === len ? false : (selectedIndices.has(index + 1) && selectedIndices.has(index - 1));
    };

    const canIndex = (index: number) => {
        if (isIndexEntity(index))
            return false;

        if (isIndexInMiddle(index))
            return false;

        if (selectedIndices.length()) {
            return (selectedIndices.length() === 1 && selectedIndices.at(0) === index) || isIndexNearAnother(index);
        } else {
            return true;
        }

    }

    const convert = (s?: IDrawableSentence) => {
        setShouldDraw(false);
        if (!s || !s?.words.length)
            return [];
        const data: IConvertedSentence = s.words.split(' ').map((w) => ({word: w}));
        for (let en of s.entities) {
            for (let i = en.start; i <= en.end; i++)
                data[i]['line'] = true;
            data[en.start]['startOfEntity'] = true;
            data[en.end]['endOfEntity'] = true;
            data[en.start + Math.floor((en.end - en.start) / 2)]['entity'] = true;
            data[en.start + Math.floor((en.end - en.start) / 2)]['draw'] = {};
            data[en.start + Math.floor((en.end - en.start) / 2)]['draw']['id'] = Str.random();
        }
        let level = 0;

        const cons: IDrawableConnections = [];
        for (let rel of s.relations) {
            const fromEn = s.entities[rel.fromEntity];
            const toEn = s.entities[rel.toEntity];
            let con1, con2;
            for (let i = fromEn.start; i <= fromEn.end; i++) {
                data[i]['level'] = level;
                if (data[i]?.entity === true) {
                    con1 = {
                        'name': rel.name,
                        'from': true,
                        id: data[i]['draw']['id'],
                        level
                    }
                }
            }
            for (let i = toEn.start; i <= toEn.end; i++) {
                data[i]['level'] = level;
                if (data[i]?.entity === true) {
                    con2 = {
                        'name': rel.name,
                        'from': false,
                        id: data[i]['draw']['id'],
                        level
                    };
                }
            }
            cons.push([con1, con2]);
            level++;
        }

        setConnections(cons);

        setConvertedSentence(data);
        return convertedSentence();
    }

    const drawLines1 = () => {
        if (shouldDraw()) {
            lines.map((el) => el.remove());
            const _ = [];
            let tmp = -1;
            for (let c of connections() ?? []) {
                _.push(new LeaderLine(document.getElementById(c[0].id), document.getElementById(c[1].id), {
                    color: Random.color(Random.colorHex(0, 10)),
                    size: 1,
                    // dash: {animation: true},
                    middleLabel: LeaderLine.captionLabel(`${c[0].name}`, {
                        // offset: [(-1) ** (tmp++) === -1 ? -50 : 50, 5],
                        // offset: [-500, 5],
                        color: 'black',
                        fontSize: '12px',
                        fontStretch: 'expanded',
                    }),
                    dash: {len: 4, gap: 7},
                    dropShadow: true,
                    opacity: 1,
                    path: 'arc',
                    // startSocket: 'right', endSocket: 'left',
                    // startSocketGravity: tmp % 2 === 1 ? 1 : -1,
                    // endSocketGravity: tmp % 2 === 0 ? -1 : 1,
                    startSocketGravity: -1,
                    endSocketGravity: -1,
                }));
                tmp++;
            }
            lines = _;
        }
    }

    const drawLines2 = () => {
        if (shouldDraw()) {
            // const p = document.getElementById('__arrowLineInternal-svg-canvas');
            // if(p)
            //     p.innerHTML='';
            const offset = 4;
            lines.map((el) => el.remove());
            const _ = [];
            let tmp = -1;

            for (let c of connections() ?? []) {
                c.innerText = `${c[0].name}`;
                const dom1 = document.getElementById(c[0].id);
                const dom2 = document.getElementById(c[1].id);
                const col = Random.color(Random.colorHex(0, 10));

                _.push(arrowLine({
                    source: {
                        x: window.scrollX + dom1.getBoundingClientRect().x,
                        y: window.scrollY + dom1.getBoundingClientRect().y,
                    },
                    destination: {
                        x: window.scrollX + dom1.getBoundingClientRect().x,
                        y: window.scrollY + dom1.getBoundingClientRect().y - c[0]['level'] * offset - 10,
                    },
                    curvature: 0,
                    color: col,
                    thickness: 1,
                    style: 'solid',
                    endpoint: {type: 'none'}
                    // forceDirection:'vertical',
                }))
                _.push(arrowLine({
                    source: {
                        x: window.scrollX + dom1.getBoundingClientRect().x,
                        y: window.scrollY + dom1.getBoundingClientRect().y - c[0]['level'] * offset - 10,
                    },
                    destination: {
                        x: window.scrollX + dom2.getBoundingClientRect().x,
                        y: window.scrollY + dom2.getBoundingClientRect().y - c[1]['level'] * offset - 10,
                    },
                    curvature: 0.5,
                    color: col,
                    thickness: 1,
                    // style: 'dot',
                    endpoint: {type: 'none'}
                    // forceDirection:'vertical',
                }))

                _.push(<svg xmlns="http://www.w3.org/2000/svg">
                    <text
                        x={Math.floor((2 * window.scrollX + dom2.getBoundingClientRect().x + dom1.getBoundingClientRect().x) / 2) + c[1]['level'] * 3}
                        y={Math.floor((2 * window.scrollY + dom2.getBoundingClientRect().y + dom1.getBoundingClientRect().y) / 2) - c[1]['level'] * offset - 10 + 3}
                        // y={35}
                        style="font-size:11px">
                        {c[0].name}
                    </text>
                </svg>)

                document.getElementById('__arrowLineInternal-svg-canvas').append(_.at(_.length - 1));

                document.getElementById('__arrowLineInternal-svg-canvas').setAttribute('height',
                    document.getElementById('root').clientHeight + 50
                )
                _.push(arrowLine({
                    source: {
                        x: window.scrollX + dom2.getBoundingClientRect().x,
                        y: window.scrollY + dom2.getBoundingClientRect().y - c[1]['level'] * offset - 10,
                    },
                    destination: {
                        x: window.scrollX + dom2.getBoundingClientRect().x + c[1]['level'] * 2,
                        y: window.scrollY + dom2.getBoundingClientRect().y,
                    },
                    curvature: 0,
                    // color:col,
                    thickness: 1,
                    style: 'solid',
                    endpoint: {
                        size: 0.75,
                        // fillColor :col,
                    }
                    // forceDirection:'vertical',
                }))

                tmp++;
            }
            lines = _;
        }
    }


    let drawLines = drawLines2;

    const gatherData = () => {
        let entities = [...sentence()?.entities ?? []];
        if (!selectedIndices.empty()) {
            const n1 = selectedIndices.sort().first(), n2 = selectedIndices.last();
            entities.push({
                start: n1 > n2 ? n2 : n1,
                end: n1 > n2 ? n1 : n2,
                wikipedia: selectedIndices?.wikipedia ?? null
            })
        }
        // entities.sort((a, b) => {
        //     if (a.start === b.start)
        //         return 0;
        //     return a.end > b.start ? 1 : -1;
        // })
        const relations = [...sentence()?.relations.map((el) => ({
            relation: el.relation._id,
            fromEntity: el.fromEntity,
            toEntity: el.toEntity,
        })) ?? []];
        if (newRelation[0] !== undefined && newRelation[1] !== undefined && newRelation[2] !== undefined && newRelation[1] !== newRelation[0])
            relations.push({
                fromEntity: newRelation[0],
                toEntity: newRelation[1],
                relation: newRelation[2],
            });
        return {entities, relations}
    }

    createEffect(() => {
        if (convertedSentence())
            drawLines();
    });

    createEffect(() => {
        shouldDraw()
        drawLines();
    })

    const fetchTag = async (data: ITagSentenceRequest) => {
        let pre = data;
        try {
            const result = await new SentenceApi().tag(sentence()?._id, pre);
            prompt.clear();
            selectedIndices.clear().wikipedia = null;

            newRelation = [undefined, undefined, undefined];
            setShouldDraw(false);
            setSentence(result.props.data);
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }

    const MakeEntityPrompt = async () => {
        if (sentence()?.status !== SENTENCE_STATUS['editing'] || sentence()?.user?._id !== helper.storage.get('user', {'goz': true})['_id'])
            return;
        newRelation = [undefined, undefined, undefined];
        if (selectedIndices.empty())
            return prompt.clear();
        let link = null;
        prompt.setSwipeable({
            header: selectedIndices.all().sort().map((index) => convertedSentence()[index].word).join(' '),
            children: <>
                <div class=" grid content-center justify-items-center my-4">
                    <TextInput placeholder={Lang.get('placeholders.wikipedia')} onChange={(value: string) => {
                        if (!!value)
                            link = value;
                        else
                            link = null;
                        selectedIndices.wikipedia = link;
                    }}/>
                    <div class="inline-flex rounded-md shadow-sm space-x-3">
                        <button type="button" onClick={async () => await fetchTag(gatherData())}
                                class="text-blue-600 items-center hover:text-white border border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">
                            Create
                        </button>

                        <button type="button" onClick={() => prompt.clear()}
                                class="text-red-600 items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                            Cancel
                        </button>
                    </div>
                </div>
            </>
        });
    }

    const MakeEntityDeletionPrompt = async (index: number, hasRelation: boolean) => {
        if (sentence()?.status !== SENTENCE_STATUS['editing'] || sentence()?.user?._id !== helper.storage.get('user', {'goz': true})['_id'])
            return;
        newRelation = [undefined, undefined, undefined];
        const entity = sentence()?.entities[index];

        selectedIndices.clear().wikipedia = entity?.wikipedia;
        prompt.setSwipeable({
            header: sentence()?.words.split(' ').filter((e, i) => i <= entity?.end && i >= entity?.start).join(' '),
            children: <>
                <div class=" grid content-center justify-items-center my-4">
                    <TextInput value={entity?.wikipedia ?? ''} onChange={(value: string) => {
                        selectedIndices.wikipedia = !!value ? value : null;
                    }}/>
                    <div class="inline-flex rounded-md shadow-sm space-x-3">
                        <button type="button" onClick={async () => {
                            const data = gatherData();
                            data.entities[index].wikipedia = selectedIndices.wikipedia;
                            await fetchTag(data);
                        }}
                                class="text-blue-600 items-center hover:text-white border border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">
                            Update
                        </button>
                        <Show when={!hasRelation}>
                            <button type="button" onClick={async () => {
                                const data = gatherData();
                                data.entities.splice(index, 1);
                                for (let i = 0; i < data.relations?.length ?? 0; i++) {
                                    const relation = data.relations[i];
                                    if (relation.toEntity > index)
                                        relation.toEntity -= 1;
                                    if (relation.fromEntity > index)
                                        relation.fromEntity -= 1;
                                }
                                await fetchTag(data);
                            }}
                                    class="text-red-600 items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                Delete
                            </button>
                        </Show>
                    </div>
                </div>
            </>
        })
        ;
    }

    const MakeRelationPrompt = async () => {
        if (sentence()?.status !== SENTENCE_STATUS['editing'] || sentence()?.user?._id !== helper.storage.get('user', {'goz': true})['_id'])
            return;
        const ents = sentence()?.entities;
        const selecteds = [...selectedEntities];
        setRelationDescription('');
        selectedEntities = [];
        newRelation = [undefined, undefined, undefined];
        if (selecteds.length === 2) {
            console.log('selecteds', selecteds);
            for (let i = 0; i < ents?.length; i++) {
                if (ents[i].start <= selecteds[0] && ents[i].end >= selecteds[0]) {
                    selecteds[0] = i;
                    newRelation[0] = i;
                    break;
                }
            }
            for (let i = 0; i < ents?.length; i++) {
                if (ents[i].start <= selecteds[1] && ents[i].end >= selecteds[1]) {
                    selecteds[1] = i;
                    newRelation[1] = i;
                    break;
                }
            }
        }
        selectedIndices.clear().wikipedia = null;
        const words = sentence()?.words.split(' ');
        prompt.setSide({
            align: 'right',
            header: 'New relation',
            children: <>
                <Form
                    header={Lang.get('words.makeRelation')}
                    class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
                >
                    <SelectInput label={Lang.get('words.from')} value={selecteds.length > 0 ? `${selecteds[0]}` : ''}
                                 options={sentence()?.entities
                                     .map((el, index) => ({
                                         text: words.slice(el.start, el.end + 1).join(' '),
                                         value: `${index}`
                                     }))} onChange={(val) => {
                        newRelation[0] = parseInt(val)
                    }}/>

                    <SelectInput value={selecteds.length > 1 ? `${selecteds[1]}` : ''} label={Lang.get('words.to')}
                                 options={sentence()?.entities.map((el, index) => ({
                                     text: words.slice(el.start, el.end + 1).join(' '),
                                     value: `${index}`
                                 }))} onChange={(val) => {
                        newRelation[1] = parseInt(val)
                    }}/>

                    <SelectInput label={Lang.get('words.relationType')} value={''} options={relations()}
                                 onChange={(val) => {
                                     newRelation[2] = val
                                     for (let r of relations() ?? []) {
                                         if (r.value === val) {
                                             setRelationDescription(r.description);
                                             break;
                                         }
                                     }
                                 }}/>

                    <p class="mb-2 text-teal-600">{relationDescription()}</p>

                    <Button onClick={async (setLoading) => {
                        console.log('newRelation', newRelation);

                        setLoading(true);
                        fetchTag(gatherData()).finally(() => {
                            setLoading(false);
                            prompt.clear();
                        });
                    }}
                            class={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}>
                        {Lang.get('words.store')}
                    </Button>
                </Form>
            </>
        })
    }

    const MakeStatusPrompt = async () => {
        if (sentence()?.status !== SENTENCE_STATUS['editing'] || sentence()?.user?._id !== helper.storage.get('user', {'goz': true})['_id'])
            return;
        newRelation = [undefined, undefined, undefined];
        selectedIndices.clear().wikipedia = null;
        prompt.setSwipeable({
            // header: 'Status' + `${!!sentence()?.description ? ': ' + sentence()?.description : ''}`,
            header: Lang.get('words.status'),
            children: <>
                <div class=" grid content-center justify-items-center my-4">
                    <div class="inline-flex rounded-md shadow-sm space-x-3">
                        <Button onClick={async (setLoading) => await fetchAwaitRelease(setLoading, 'await')}
                                class="border border-t border-r border-b border-gray-200 focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium text-sm px-4 py-2  dark:focus:ring-orange-900"
                        >
                            {Lang.get('words.waiting')}
                        </Button>
                        <Button onClick={async (setLoading) => await fetchAwaitRelease(setLoading, 'release')}
                                class="text-gray-500 bg-white border border-gray-200 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-4 py-2  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-70"
                        >
                            {Lang.get('words.release')}
                        </Button>
                    </div>
                </div>
            </>
        })
    }

    const MakeDeletePrompt = async () => {
        if (!helper.storage.get('user', undefined)?.privileges?.includes(USER_PRIVILEGES["destroy sentence"]))
            return;
        newRelation = [undefined, undefined, undefined];
        selectedIndices.clear().wikipedia = null;
        prompt.setSwipeable({
            // header: 'Status' + `${!!sentence()?.description ? ': ' + sentence()?.description : ''}`,
            header: 'Are you sure?',
            children: <>
                <div class=" grid content-center justify-items-center my-4">
                    <div class="inline-flex rounded-md shadow-sm space-x-3">
                        <Button onClick={async (setLoading) => await fetchDelete(setLoading)}
                                class="text-red-500 bg-white border border-red-200 focus:outline-none hover:bg-red-100 focus:ring-4 focus:ring-red-200 font-medium text-sm px-4 py-2  dark:bg-red-800 dark:text-white dark:border-red-600 dark:hover:bg-red-700 dark:hover:border-red-600 dark:focus:ring-red-70"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </>
        })
    }

    const MakePublishPrompt = async () => {
        if (!helper.storage.get('user', undefined)?.privileges?.includes(USER_PRIVILEGES["publish sentence"]))
            return;
        // if (sentence()?.status !== SENTENCE_STATUS['editing'] || sentence()?.user?._id !== helper.storage.get('user', {'goz': true})['_id'])
        //     return;
        newRelation = [undefined, undefined, undefined];
        selectedIndices.clear().wikipedia = null;
        const words = sentence()?.words.split(' ');
        let text = '';
        prompt.setSide({
            align: 'right',
            header: 'Publish',
            children: <>
                <Form
                    header={Lang.get('words.checkSentence')}
                    class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
                >
                    <TextArea value="" placeholder={Lang.get('placeholders.description')} onChange={(val) => {
                        text = val
                    }}/>

                    <div class=" grid content-center justify-items-center my-4">
                        <div class="inline-flex rounded-md shadow-sm space-x-3">
                            <Button onClick={async (setLoading) => await fetchPublish(setLoading, 'publish', text)}
                                    class="border-t border-r border-b border-gray-200 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium text-sm px-4 py-2  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                {Lang.get('words.publish')}
                            </Button>
                            <Button onClick={async (setLoading) => await fetchPublish(setLoading, 'refuse', text)}
                                    class="border border-t border-r border-b border-gray-200 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-4 py-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    type="button">
                                {Lang.get('words.refuse')}
                            </Button>
                        </div>
                    </div>
                </Form>
            </>
        })
    }

    const RelationListPrompt = async () => {
        // if (sentence()?.status !== SENTENCE_STATUS['editing'] || sentence()?.user?._id !== helper.storage.get('user', {'goz': true})['_id'])
        //     return;
        newRelation = [undefined, undefined, undefined];
        selectedIndices.clear().wikipedia = null;
        const words = sentence()?.words.split(' ');
        prompt.setSide({
            align: 'right',
            header: 'Relations',
            children: <>

                <div
                    class="p-5 mb-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <time class="text-lg font-semibold text-gray-900 dark:text-white"></time>
                    <ol class="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
                        <For each={sentence()?.relations ?? []}>{(r, index) =>

                            <li>
                                <div
                                    class="items-center block p-3 sm:flex hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div class="text-gray-600 dark:text-gray-400">
                                        <div class="text-base font-normal">
                                            <span class="font-medium text-gray-900 dark:text-white">{r.name}</span>
                                        </div>
                                        <div
                                            class="text-sm font-normal">"{words.slice(sentence()?.entities[r.fromEntity].start, sentence()?.entities[r.fromEntity].end + 1).join(' ')}"
                                        </div>
                                        <div
                                            class="text-sm font-normal">"{words.slice(sentence()?.entities[r.toEntity].start, sentence()?.entities[r.toEntity].end + 1).join(' ')}"
                                        </div>
                                        <Button onClick={async (setLoading) => {
                                            const data = gatherData();
                                            data.relations.splice(index(), 1);
                                            await fetchTag(data);
                                        }} class="font-medium text-red-600 dark:text-red-500 hover:underline">
                                            <svg class="w-3 h-3 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 18 20">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </li>

                        }</For>

                    </ol>
                </div>

            </>
        })
    }

    let scrollTimeout = null;

    const scrollendDelay = 1200; // ms

    function redoLines() {
        drawLines();
        return;
        lines.map((l) => l.remove());
    }

    function redoLinesOnScroll() {
        if (scrollTimeout === null) {
        } else
            clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(redoLines, scrollendDelay);
    }

    let resizeObserver = new ResizeObserver(redoLines);

    resizeObserver.observe(document.getElementsByTagName("body")[0]);

    window.addEventListener("scroll", redoLinesOnScroll);

    onCleanup(() => {
        prompt.clear();
        window.removeEventListener('scroll', redoLinesOnScroll)
        resizeObserver.disconnect();
        lines.map((l) => l.remove());
    });

    const popOverId = Str.random();

    const fetchDelete = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new SentenceApi().delete(sentence()?._id);
            setLoading(false);
            location.reload();
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }
    const fetchOpen = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new SentenceApi().open(sentence()?._id);
            setLoading(false);
            prompt.clear();
            selectedIndices.clear().wikipedia = null;
            newRelation = [undefined, undefined, undefined];
            setShouldDraw(false);
            setSentence(result.props.data);
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchAwaitRelease = async (setLoading: Setter<boolean>, status: 'await' | 'release') => {
        setLoading(true);
        try {
            const result = await new SentenceApi().status(sentence()?._id, status);
            setLoading(false);
            prompt.clear();
            selectedIndices.clear().wikipedia = null;
            newRelation = [undefined, undefined, undefined];
            setShouldDraw(false);
            setSentence(result.props.data);
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchPublish = async (setLoading: Setter<boolean>, status: 'publish' | 'refuse', description: string) => {
        setLoading(true);
        try {
            const result = await new SentenceApi().publish(sentence()?._id, status, description);
            setLoading(false);
            prompt.clear();
            selectedIndices.clear().wikipedia = null;
            newRelation = [undefined, undefined, undefined];
            setShouldDraw(false);
            setSentence(result.props.data);
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <LoadingShell loading={!relations() || !sentence()}>
                <div class="flex flex-row flex-wrap ">
                    <For each={convert(sentence())}>{(el, index) =>
                        <div class=" relative mb-6">
                            <div class="px-4 flex items-center text-center" onClick={async () => {
                                if (el?.draw && el.entity === true) {
                                    if (selectedEntities.length == 1) {
                                        if (index() === selectedEntities[0])
                                            return;
                                        selectedEntities.push(index());
                                        await MakeRelationPrompt();
                                    } else {
                                        selectedEntities = [index()];
                                    }
                                }
                            }}>
                                <Show when={el?.draw} fallback={
                                    <>
                                        <div
                                            style={` font-size:12px ;`}
                                            class={`${el.entity === true ? 'bg-blue-100' : 'bg-transparent text-transparent'} z-10   rounded-full  `}>
                                            ENTITY
                                        </div>
                                    </>
                                }>
                                    <div id={el?.draw?.id ?? ''}
                                        //style={`margin-bottom:${el?.level !== undefined ? el?.level*10 + 18 : 8 }px; font-size:12px ;`}
                                         style={`font-size:12px ;`}
                                         class={`${el.entity === true ? 'bg-blue-100' : 'bg-transparent text-transparent'} z-10   rounded-full    `}>
                                        {/*{el.entity === true ? 'ENTITY' : ' '}*/}
                                        ENTITY
                                    </div>
                                </Show>
                            </div>
                            <div
                                class={`${el?.line === true ? 'bg-gray-200' : 'bg-transparent'} mt-2 flex w-auto bg-gray-200 h-0.5 ${el?.endOfEntity === true ? ` ${helper.storage.get('dir', 'ltr') === 'ltr' ? 'border-r-2' : 'border-l-2'} border-red-600` : ''}  `}></div>
                            <div class="mt-3 ">
                                <p onClick={() => {
                                    if (canIndex(index()))
                                        selectedIndices.toggle(index());
                                }} onContextMenu={async (e) => {
                                    e.preventDefault();
                                    if (el.entity === true) {
                                        const _ = sentence()?.entities ?? [];
                                        const ind = index();
                                        for (let i = 0; i < (_?.length ?? 0); i++) {
                                            if (_[i].start <= ind && _[i].end >= ind) {
                                                let hasRelation = false;
                                                for (let r of sentence()?.relations) {
                                                    if (r.toEntity === i || r.fromEntity === i) {
                                                        hasRelation = true;
                                                    }
                                                }
                                                await MakeEntityDeletionPrompt(i, hasRelation);
                                                break;
                                            }
                                        }
                                    }
                                    return false;
                                }}
                                   class={`${selectedIndices.has(index()) ? 'bg-gray-100' : ''} cursor-grabbing text-base text-center font-normal text-gray-500 dark:text-gray-400 hover:text-blue-600`}>
                                    {el.word}
                                </p>
                            </div>
                        </div>
                    }</For>

                    {(() => {
                        shouldDraw();
                        setShouldDraw(true);
                        return '';
                    })()}

                </div>

                <div class=" grid content-center justify-items-center">
                    <div class="inline-flex rounded-md shadow-sm">
                        <Show
                            when={sentence()?.status === SENTENCE_STATUS.editing && sentence()?.user?._id === helper.storage.get('user', undefined)?._id}
                            fallback={
                                <>
                                    <Switch>
                                        <Match when={sentence()?.status === SENTENCE_STATUS.unchanged}>
                                            <Button onClick={fetchOpen}
                                                    class="text-gray-500 bg-white border border-gray-200 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-4 py-2  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-70"
                                                    type="button">
                                                {Lang.get('words.unchanged')}
                                            </Button>
                                        </Match>
                                        <Match when={sentence()?.status === SENTENCE_STATUS.published}>

                                            <div id={popOverId} role="tooltip"
                                                 class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div
                                                    class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                                    <h3 class="font-semibold text-gray-900 dark:text-white">Description</h3>
                                                </div>
                                                <div class="px-3 py-2">
                                                    <p>{sentence()?.description ?? ''}</p>
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                            <Button onClick={fetchOpen} onMouseOver={(e) => {
                                                const $targetEl: HTMLElement = document.getElementById(popOverId);
                                                const $triggerEl: HTMLElement = e.target;
                                                const options: TooltipOptions = {
                                                    placement: 'top',
                                                    triggerType: 'hover',
                                                    onHide: () => {
                                                    },
                                                    onShow: () => {
                                                    },
                                                    onToggle: () => {
                                                    }
                                                };
                                                const tooltip = new Tooltip($targetEl, $triggerEl, options);
                                                tooltip.show();
                                            }} onMouseLeave={(e) => {
                                                const $targetEl: HTMLElement = document.getElementById(popOverId);
                                                const $triggerEl: HTMLElement = e.target;
                                                const options: TooltipOptions = {
                                                    placement: 'top',
                                                    triggerType: 'hover',
                                                    onHide: () => {
                                                    },
                                                    onShow: () => {
                                                    },
                                                    onToggle: () => {
                                                    }
                                                };
                                                const tooltip = new Tooltip($targetEl, $triggerEl, options);
                                                tooltip.hide();
                                            }}
                                                    class="border-t border-r border-b border-gray-200 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium text-sm px-4 py-2  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                            >
                                                {Lang.get('words.published')}
                                            </Button>
                                        </Match>
                                        <Match when={sentence()?.status === SENTENCE_STATUS.waiting}>
                                            <Button onClick={fetchOpen}
                                                    class="border border-t border-r border-b border-gray-200 focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium text-sm px-4 py-2  dark:focus:ring-orange-900"
                                                    type="button">
                                                {Lang.get('words.waiting')}
                                            </Button>
                                        </Match>
                                        <Match when={sentence()?.status === SENTENCE_STATUS.refused}>

                                            <div data-popover id={popOverId} role="tooltip"
                                                 class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div
                                                    class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                                    <h3 class="font-semibold text-gray-900 dark:text-white">Description</h3>
                                                </div>
                                                <div class="px-3 py-2">
                                                    <p>{sentence()?.description}</p>
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                            <Button

                                                onClick={fetchOpen} onMouseOver={(e) => {
                                                const $targetEl: HTMLElement = document.getElementById(popOverId);
                                                const $triggerEl: HTMLElement = e.target;
                                                const options: TooltipOptions = {
                                                    placement: 'top',
                                                    triggerType: 'hover',
                                                    onHide: () => {
                                                    },
                                                    onShow: () => {
                                                    },
                                                    onToggle: () => {
                                                    }
                                                };
                                                const tooltip = new Tooltip($targetEl, $triggerEl, options);
                                                tooltip.show();
                                            }} onMouseLeave={(e) => {
                                                const $targetEl: HTMLElement = document.getElementById(popOverId);
                                                const $triggerEl: HTMLElement = e.target;
                                                const options: TooltipOptions = {
                                                    placement: 'top',
                                                    triggerType: 'hover',
                                                    onHide: () => {
                                                    },
                                                    onShow: () => {
                                                    },
                                                    onToggle: () => {
                                                    }
                                                };
                                                const tooltip = new Tooltip($targetEl, $triggerEl, options);
                                                tooltip.hide();
                                            }}
                                                onClick={fetchOpen}
                                                class="border border-t border-r border-b border-gray-200 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-4 py-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                type="button">
                                                {Lang.get('words.refused')}
                                            </Button>
                                        </Match>
                                    </Switch>
                                    <Show
                                        when={sentence()?.relations?.length}>

                                        <button onClick={RelationListPrompt}
                                                class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            {Lang.get('words.relations')}
                                        </button>

                                    </Show>
                                    <Show
                                        when={helper.storage.get('user', null)?.privileges?.includes(USER_PRIVILEGES["publish sentence"])}>

                                        <button onClick={MakePublishPrompt}
                                                class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            {Lang.get('words.assign')}
                                        </button>

                                    </Show>
                                    <button onClick={() => {
                                        unsecuredCopyToClipboard(sentence()?.words ?? '');
                                        //navigator.clipboard.writeText(sentence()?.words ?? '');
                                        toast.success(Lang.get('words.wasSuccess'));
                                    }}
                                            class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        {Lang.get('words.copy')}
                                    </button>

                                </>
                            }>
                            <Button onClick={MakeRelationPrompt}
                                    class={`px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 ${helper.storage.get('dir') === 'ltr' ? 'rounded-l-md' : 'rounded-r-md'} hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white`}>
                                {Lang.get('words.makeRelation')}
                            </Button>
                            <Button onClick={MakeEntityPrompt}
                                    class="px-4 py-2 text-sm font-medium text-blue-600  bg-white border-t border-r border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                {Lang.get('words.makeEntity')}
                            </Button>

                            <button onClick={MakeStatusPrompt}
                                    class="border-t border-r border-b border-gray-200 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium text-sm px-4 py-2  dark:focus:ring-yellow-900"
                                    type="button">
                                {Lang.get('words.editing')}
                            </button>

                            <Show
                                when={sentence()?.relations?.length}>

                                <button onClick={RelationListPrompt}
                                        class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    {Lang.get('words.relations')}
                                </button>

                            </Show>

                            <button onClick={MakePublishPrompt}
                                    class="border-t border-r border-b border-gray-200 px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                {Lang.get('words.assign')}
                            </button>


                            <A href={Url.front('sentenceUpdate', sentence()?._id)}
                               class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                {Lang.get('words.words')}
                            </A>

                            <A target="_blank" href={Url.front('sentenceTag', sentence()?._id)}
                               class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                {Lang.get('words.newPage')}
                            </A>

                            <button onClick={async () => {
                                unsecuredCopyToClipboard(sentence()?.words ?? '');
                                toast.success(Lang.get('words.wasSuccess'));
                            }}
                                    class="px-4 py-2  text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                {Lang.get('words.copy')}
                            </button>

                            <Button onClick={MakeDeletePrompt}
                                    class={`px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-200 ${helper.storage.get('dir') === 'ltr' ? 'rounded-r-md' : 'rounded-l-md'} hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white`}>
                                {Lang.get('words.delete')}
                            </Button>

                        </Show>
                    </div>
                </div>

            </LoadingShell>
        </>
    );
}

export default Sentence;