import {Component, createSignal, For, Setter, Show} from "solid-js";
import TextInput from "../../../Component/Input/TextInput";
import TextArea from "../../../Component/Input/TextArea";
import Button from "../../../Component/Button/Button";
import Form from "../../../Component/Form/Form";
import DataObject from "../../../Core/Class/DataObject";
import UserApi from "../../Api/User.api";
import {useHelper} from "../../../Core/Helper/Helper";
import SentenceApi, {IFullSentenceResponse} from "../../Api/Sentence.api";
import {useParams} from "@solidjs/router";
import Lang from "../../../Core/Helper/Lang";
import Sentence from "../../Component/Sentence";
import LoadingShell from "../../../Component/Loading/LoadingShell";
import TableHeader from "../../../Component/Table/TableHeader";
import {usePrompt} from "../../../Core/Helper/Prompt";


const SentenceTagPage: Component = () => {
    const params = useParams<{ sentence: string }>();

    const helper = useHelper();

    const [sentence, setSentence] = createSignal<undefined | IFullSentenceResponse>(undefined, {equals: false});

    const fetchSentence = async () => {
        try {
            const result = await new SentenceApi().show(params.sentence);
            setSentence(result.props.data);
            console.log('result', result);
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        }
    }

    fetchSentence();

    return (
        <>
            <LoadingShell loading={!sentence()}>
                <div class="mt-56  py-2 lg:py-8 px-4 w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                    <Sentence sentence={sentence()}/>
                </div>
            </LoadingShell>

        </>
    )
        ;
}

export default SentenceTagPage;