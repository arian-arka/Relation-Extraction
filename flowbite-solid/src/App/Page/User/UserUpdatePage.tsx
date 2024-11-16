import {Component, createSignal, Setter} from "solid-js";
import TextInput from "../../../Component/Input/TextInput";
import Form from "../../../Component/Form/Form";
import {useHelper} from "../../../Core/Helper/Helper";
import DataObject from "../../../Core/Class/DataObject";
import Button from "../../../Component/Button/Button";
import UserApi, {IUser} from "../../Api/User.api";
import {A, useParams} from "@solidjs/router";
import LoadingShell from "../../../Component/Loading/LoadingShell";
import Lang from "../../../Core/Helper/Lang";
import Table from "../../../Component/Table/Table";
import Url from "../../../Core/Helper/Url";
import TableHeader from "../../../Component/Table/TableHeader";
import TableLimit from "../../../Component/Table/TableLimit";
import TableFilterList from "../../../Component/Table/TableFilterList";
import {USER_PRIVILEGES} from "../../Constants";
import CheckboxInput from "../../../Component/Input/CheckboxInput";
import {useToast} from "../../../Core/Helper/Toast";

const UserUpdatePage: Component = () => {
    const params = useParams<{ user: string }>();
    const helper = useHelper();
    const [user, setUser] = createSignal<undefined | IUser>(undefined);
    const data = new DataObject();
    const errors = new DataObject();
    const toast = useToast();
    const fetchUpdate = async (setLoading: Setter<boolean>) => {
        setLoading(true);
        try {
            const result = await new UserApi().update(params.user, data.all());
            data.gather(result.props.data, ['name', 'email']);
            setUser(result.props.data);
            errors.clear();
            console.log('result', result);
            toast.success(Lang.get('words.wasSuccess'));
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 400){
                toast.danger(e.message);
                errors.set(e.messages);}
            else if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchGrant = async (setLoading: Setter<boolean>,grant:boolean,privileges : number[]) => {
        setLoading(true);
        let success  = true;
        try {
            const result = await new UserApi().grant(params.user, {
                grant,privileges
            });
            data.gather(result.props.data, ['name', 'email']);
            setUser(result.props.data);
            errors.clear();
            console.log('result', result);
        } catch (e) {
            console.log('e', e);
            if (e.props.status === 400)
                errors.set(e.messages);
            else if (e.props.status === 401) {
                helper.storage.unset('user');
                helper.storage.unset('authenticated');
            }
            success=false;

        }finally {
            setLoading(false);
        }
        return success;
    }

    const fetchUser = async () => {
        try {
            const result = await new UserApi().show(params.user);
            data.gather(result.props.data, ['name', 'email']);
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

    fetchUser();

    return (<>
        <LoadingShell loading={!user()}>
            <div class="px-4 py-2 lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form
                    header={Lang.get('words.updateUser')}
                    class={` p-4 h-min mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
                >

                    <TextInput value={user()?.name} label={Lang.get('words.name')}
                               placeholder={Lang.get('placeholders.name')} type='text' error={{
                        text: errors.all()?.name ?? '',
                    }} onChange={(val) => data.setKey('name', val)}/>

                    <TextInput value={user()?.email} label={Lang.get('words.email')} placeholder="name@domain.com"
                               type='email' error={{
                        text: errors.all()?.email ?? '',
                    }} onChange={(val) => data.setKey('email', val)}/>

                    <TextInput label={Lang.get('words.password')} placeholder="••••••••" type='password' error={{
                        text: errors.all()?.password ?? '',
                    }} onChange={(val) => data.setKey('password', val)}/>

                    <Button onClick={fetchUpdate}
                            class={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}>
                        {Lang.get('words.store')}
                    </Button>
                </Form>
                <Form
                    header={Lang.get('words.privileges')}
                    class={` p-4  mx-auto max-w-screen-md w-full bg-white rounded-lg shadow dark:border   dark:bg-gray-800 dark:border-gray-700`}
                >
                    {((pr) => {
                        return (<>
                            <Table rows={Object.keys(USER_PRIVILEGES).map((k) => ({
                                'text' : Lang.get(`privileges.${k}`),
                                'value' : USER_PRIVILEGES[k]
                            }))}
                                   columns={[
                                       {
                                           key: 'text',
                                           tdClass: 'px-4 py-3 text-start',
                                           thClass: 'px-4 py-3 text-start',
                                           text:' '
                                       },
                                       {
                                           key: 'value',
                                           tdClass: 'px-4 py-3 text-start',
                                           thClass: 'px-4 py-3 text-start',
                                           text: '  ',
                                           value: (val, row) => {
                                               return (
                                                   <>
                                                       <CheckboxInput
                                                           label=" "
                                                           checked={pr.includes(val)}
                                                           onChange={async (checked:boolean,setLoading:Setter<boolean>,e) => {
                                                               if(!await fetchGrant(setLoading,checked,[val]))
                                                                   e.target.checked = !e.target.checked;
                                                           }}
                                                       />
                                                   </>
                                               );
                                           }
                                       },
                                   ]}
                                   header={
                                       <>
                                           <div
                                               class="w-full basis-full lg:basis-1/4 md:basis-1/2 sm:basis-full grid grid-cols-2 gap-4">


                                               <Button onClick={async (setLoading) => {
                                                   await fetchGrant(setLoading,true,Object.values(USER_PRIVILEGES));
                                               }}
                                                  class="w-full justify-center text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700"
                                               >
                                                   <svg  class="w-4 h-4 mr-2.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                       <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                                   </svg>
                                               </Button>
                                               <Button onClick={async (setLoading) => {
                                                   await fetchGrant(setLoading,false,Object.values(USER_PRIVILEGES));
                                               }}
                                                  class="w-full justify-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                               >
                                                   <svg  class="w-4 h-4 mr-2.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                                       <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                                                   </svg>
                                               </Button>
                                           </div>
                                       </>
                                   }
                            />
                        </>);
                    })(user()?.privileges ?? [])}

                </Form>
            </div>
        </LoadingShell>
    </>);
}
export default UserUpdatePage;