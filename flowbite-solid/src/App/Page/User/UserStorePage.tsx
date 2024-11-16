import {Component, Setter} from "solid-js";
import TextInput from "../../../Component/Input/TextInput";
import Form from "../../../Component/Form/Form";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import Button from "../../../Component/Button/Button";
import UserApi from "../../Api/User.api";
import Lang from "../../../Core/Helper/Lang";
import {useToast} from "../../../Core/Helper/Toast";
import Url from "../../../Core/Helper/Url";

const UserStorePage: Component = () => {
    const toast = useToast();
    const helper = useHelper();
    const data = new DataObject();
    const errors = new DataObject();
    const fetchStore = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new UserApi().store(data.all());
            errors.clear();
            console.log('result', result);
            helper.away(Url.front('userUpdate',result.props.data._id));
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            console.log('e', e);
            if (e?.props?.status === 400){
                toast.danger(e.message);
                errors.set(e.messages);
            }
            else if (e?.props?.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <Form
            header={Lang.get('words.storeUser')}
            class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
        >

            <TextInput label={Lang.get('words.name')} placeholder={Lang.get('placeholders.name')} type='text' error={{
                text: errors.all()?.name ?? '',
            }} onChange={(val) => data.setKey('name', val)}/>

            <TextInput label={Lang.get('words.email')} placeholder="name@domain.com" type='email' error={{
                text: errors.all()?.email ?? '',
            }} onChange={(val) => data.setKey('email', val)}/>

            <TextInput  label={Lang.get('words.password')} placeholder="••••••••" type='password' error={{
                text: errors.all()?.password ?? '',
            }} onChange={(val) => data.setKey('password', val)}/>

            <Button onClick={fetchStore}
                    class={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}>
                {Lang.get('words.store')}
            </Button>
        </Form>
    </>);
}
export default UserStorePage;