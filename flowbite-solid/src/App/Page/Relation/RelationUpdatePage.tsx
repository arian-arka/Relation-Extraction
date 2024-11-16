import {Component, createSignal, Setter} from "solid-js";
import TextInput from "../../../Component/Input/TextInput";
import Form from "../../../Component/Form/Form";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import Button from "../../../Component/Button/Button";
import UserApi, {IUser} from "../../Api/User.api";
import RelationApi, {IRelation} from "../../Api/Relation.api";
import TextArea from "../../../Component/Input/TextArea";
import {useParams} from "@solidjs/router";
import {string} from "yup";
import LoadingShell from "../../../Component/Loading/LoadingShell";
import {usePrompt} from "../../../Core/Helper/Prompt";
import Url from "../../../Core/Helper/Url";
import Lang from "../../../Core/Helper/Lang";
import { useToast } from "../../../Core/Helper/Toast";

const RelationStorePage: Component = () => {
    const toast = useToast();
    const prompt = usePrompt();
    const params = useParams<{relation:string}>();
    const helper = useHelper();
    const [relation, setRelation] = createSignal<undefined | IRelation>(undefined);
    const data = new DataObject();
    const errors = new DataObject();

    const fetchUpdate = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new RelationApi().update(params.relation,data.all());
            data.gather(result.props.data, ['name', 'description']);
            errors.clear();
            console.log('result', result);
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            console.log('e', e);
            if (e?.props?.status === 400){
                toast.danger(e.message);
                errors.set(e.messages);
            }
            else if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchDestroy = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new RelationApi().destroy(params.relation);
            helper.away(Url.front('relationList'));
            console.log('result', result);
            prompt.clear();
            helper.away(Url.front('relationList'));
            toast.success(Lang.get('words.wasSuccess'));

        } catch (e) {
            console.log('e', e);
            if (e.props.status === 400)
                errors.set(e.messages);
            else if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchRelation = async () => {
        try {
            const result = await new RelationApi().show(params.relation);
            data.gather(result.props.data, ['name', 'description']);
            setRelation(result.props.data);
            console.log('result', result);
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }

    fetchRelation();

    return (<>
        <LoadingShell loading={!relation()}>
        <Form
            header={Lang.get('words.updateRelation')}
            class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
        >

            <TextInput value={relation()?.name} label={Lang.get('words.name')} placeholder={Lang.get('placeholders.name')} type='text' error={{
                text: errors.all()?.name ?? '',
            }} onChange={(val) => data.setKey('name', val)}/>

            <TextArea value={relation()?.description} label={Lang.get('words.description')} placeholder={Lang.get('placeholders.description')}  type='text' error={{
                text: errors.all()?.description ?? '',
            }} onChange={(val) => data.setKey('description', !!val ? val : null)}/>
            <div class="flex flex-wrap space-x-3  justify-center">
                <Button onClick={fetchUpdate}
                        class={`mx-1 w-1/4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}>
                    {Lang.get('words.store')}
                </Button>
                <Button onClick={() => prompt.swipeableDelete({onClick:fetchDestroy})}
                        class={`mx-1 w-1/4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 `}>
                    {Lang.get('words.delete')}
                </Button>
            </div>
        </Form>
        </LoadingShell>
    </>);
}
export default RelationStorePage;