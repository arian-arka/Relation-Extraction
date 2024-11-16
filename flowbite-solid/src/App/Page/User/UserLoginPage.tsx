import {Component, createEffect, createSignal, Setter} from "solid-js";
import LoginForm from "../../../Component/Form/LoginForm";
import Form from "../../../Component/Form/Form";
import UserApi from "../../Api/User.api";
import {useHelper} from "../../../Core/Helper/Helper";
import TextInput from "../../../Component/Input/TextInput";
import DataObject from "../../../Core/Class/DataObject";
import Lang from "../../../Core/Helper/Lang";
import relation from "../../Asset/relation.jpg";
const UserLoginPage: Component = () => {
    const helper = useHelper();
    const data= new DataObject();
    const errors= new DataObject();

    const fetchLogin = async (setLoading : Setter<boolean>) => {
        setLoading(true);
        try{
            const result = await new UserApi().login(data.all());
            errors.clear();
            console.log('result',result);
            helper.storage.set('user',result?.props?.data);
            helper.storage.set('authenticated','1');
            let intended:string|URL|null = helper.url.current().searchParams.get('intended');
            if(!!intended){
                intended = new URL(decodeURIComponent(intended));
                helper.away(`${intended.pathname}?${intended.searchParams.toString()}`);
            }else helper.away('/user/dashboard');
        }catch (e) {
            console.log('e',e);

            if(e.props.status === 400)
                errors.set(e.messages);
            else if(e.props.status === 401){
                if(!!e.props?.data?.user)
                    helper.storage.set('user',e.props?.data?.user);
                helper.storage.set('authenticated','1');
            }
            console.log('errors',errors.all());
        }finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>
                {`.test{
                    background-image: url(${relation});
                }`}
            </style>
            <LoginForm
                containerClass={`bg-no-repeat bg-cover bg-blend-multiply [background-position-y:center] [background-position-x:50%] test`}
                onLogin={fetchLogin}
                header={
                    <>
                        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-white dark:text-white">
                           {/* <img class="w-8 h-8 mr-2"
                                 src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                                 alt="logo"/>*/}
                            {Lang.get('app.name')}
                        </a>
                    </>
                }
                heading={Lang.get('words.signIn')}
                footer={
                    <>
                        {/*<p class="text-sm font-light text-gray-500 dark:text-gray-400">*/}
                        {/*    Don’t have an account yet? <a href="#"*/}
                        {/*                                  class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign*/}
                        {/*    up</a>*/}
                        {/*</p>*/}
                    </>
                }
            >
                <Form
                    class={``}
                    inputs={[
                    ]}
                >
                    <TextInput label={Lang.get('words.email')} placeholder={Lang.get('placeholders.email')} type='email' error={{
                        text : errors.all()?.email ?? '',
                    }} onChange={(val) => data.setKey('email',val)}/>

                    <TextInput label={Lang.get('words.password')} placeholder="••••••••" type='password' error={{
                        text : errors.all()?.password ?? '',
                    }} onChange={(val) => data.setKey('password',val)}/>
                </Form>
            </LoginForm>
        </>
    );
}
export default UserLoginPage;