import {Component, createSignal, Setter} from "solid-js";
import TextInput from "../../../Component/Input/TextInput";
import Form from "../../../Component/Form/Form";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import Button from "../../../Component/Button/Button";
import UserApi, {IUser} from "../../Api/User.api";
import {useParams} from "@solidjs/router";
import LoadingShell from "../../../Component/Loading/LoadingShell";
import Lang from "../../../Core/Helper/Lang";
import {useToast} from "../../../Core/Helper/Toast";
import Url from "../../../Core/Helper/Url";
import Response from "../../../Core/Class/Response";

const UserProfilePage: Component = () => {
    const toast = useToast();

    // const params = useParams<{user : string}>();
    const helper = useHelper();
    const data = new DataObject();
    const errors = new DataObject();
    const [user,setUser] = createSignal<undefined|IUser>(undefined);

    const fetchUpdate = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new UserApi().updateProfile(data.all());
            data.gather(result.props.data,['name','email']);
            setUser(result.props.data);
            helper.storage.set('user',result.props.data);
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
    const fetchProfile = async () => {
        try {
            const result = await new UserApi().self();
            // const result = await new UserApi().show(params.user);
            data.gather(result.props.data,['name','email']);
            setUser(result.props.data);
            console.log('result', result);
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }

        }
    }
    fetchProfile();

    return (<>
        <LoadingShell loading={!user()}>
            <Form
                header={Lang.get('words.profile')}
                class={` py-2 lg:py-8 px-4 mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
            >

                <TextInput value={user()?.name} label={Lang.get('words.name')} placeholder={Lang.get('placeholders.name')} type='text' error={{
                    text: errors.all()?.name ?? '',
                }} onChange={(val) => data.setKey('name', val)}/>

                <TextInput value={user()?.email} label={Lang.get('words.email')} placeholder="name@domain.com" type='email' error={{
                    text: errors.all()?.email ?? '',
                }} onChange={(val) => data.setKey('email', val)}/>

                <TextInput label={Lang.get('words.password')} placeholder="••••••••" type='password' error={{
                    text: errors.all()?.password ?? '',
                }} onChange={(val) => data.setKey('password', val)}/>

                <TextInput label={Lang.get('words.newPassword')} placeholder={Lang.get('placeholders.notRequired')} type='password' error={{
                    text: errors.all()?.newPassword ?? '',
                }} onChange={(val) => data.setKey('newPassword', val)}/>

                <Button onClick={fetchUpdate}
                        class={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}>
                    {Lang.get('words.store')}
                </Button>
            </Form>
        </LoadingShell>
    </>);
}
export default UserProfilePage;