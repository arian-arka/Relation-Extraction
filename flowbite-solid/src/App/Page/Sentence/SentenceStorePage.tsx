import {Component, createSignal, For, Setter, Show} from "solid-js";
import TextInput from "../../../Component/Input/TextInput";
import TextArea from "../../../Component/Input/TextArea";
import Button from "../../../Component/Button/Button";
import Form from "../../../Component/Form/Form";
import DataObject from "../../../Core/Class/DataObject";
import UserApi from "../../Api/User.api";
import {useHelper} from "../../../Core/Helper/Helper";
import SentenceApi from "../../Api/Sentence.api";
import Lang from "../../../Core/Helper/Lang";
import Url from "../../../Core/Helper/Url";
import {useToast} from "../../../Core/Helper/Toast";

const textToWords = (text: string) => {
    if(!text || text.length === 0)
        return [];
    const words: string[] = text.split(/\s+/);
    if (words.length > 0 && words[0].length === 0)
        words.splice(0, 1);
    if (words.length > 0 && words[words.length - 1].length === 0)
        words.splice(words.length - 1, 1);
    return words;
}

const SentenceStorePage : Component = () => {
    const helper = useHelper();
    const [words,setWords] = createSignal<string[]>([],{equals:false});
    const errors = new DataObject();
    const toast= useToast();
    const fetchStore = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new SentenceApi().store({words:words()});
            errors.clear();
            console.log('result', result);
            helper.away(Url.front('sentenceUpdate',result.props.data._id));
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
    return (
        <>
            <Form
                header={Lang.get('words.storeSentence')}
                class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
            >
                <TextArea label={Lang.get('words.sentence')} placeholder={Lang.get('placeholders.words')} error={{
                    text: errors.all()?.words ?? '',
                }} onInput={(val) => setWords(textToWords(val))}/>

                <Show when={words().length}>
                <section
                    class="bg-white border border-gray-200 rounded-lg shadow sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8  dark:bg-gray-800 dark:border-gray-700 mt-4">
                    <p class="mb-4 text-medium text-center text-gray-900 dark:text-gray-400 sm:mb-0">
                        <For each={words()}>{(w) =>
                            <>
                                [ {w} ]
                            </>
                        }</For>
                    </p>
                </section>
                </Show>
                <br/>
                <br/>

                <Button onClick={fetchStore}
                        class={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}>
                    {Lang.get('words.store')}
                </Button>
            </Form>


        </>
    );
}

export default SentenceStorePage;