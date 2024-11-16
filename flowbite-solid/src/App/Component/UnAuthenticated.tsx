import {Outlet} from "@solidjs/router";
import {Component, onCleanup, onMount} from "solid-js";
import {useHelper} from "../../Core/Helper/Helper";
import Str from "../../Core/Helper/Str";
import Url from "../../Core/Helper/Url";


const Authenticated: Component = (props) => {
    const helper = useHelper();
    const id = Str.random();

    // const u = () => {
    //     const previous = helper.url.current().searchParams.get('intended');
    //     if(!!previous)
    //         return '/';
    //     return Url.front('userDashboard');
    // }

    if (helper.storage.get('authenticated', '0') === "1") {
        helper.away('/user/dashboard');
    }

    helper.storage.subscribe(id, (vals) => {
        if( vals?.authenticated === "1")
            helper.away('/user/dashboard');
    })

    onCleanup(() => {
        helper.storage.unsubscribe(id);
    })
    return (
        <>
            <Outlet/>
        </>
    );
}
export default Authenticated;