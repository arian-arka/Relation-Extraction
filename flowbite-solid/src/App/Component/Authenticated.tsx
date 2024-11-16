import {Outlet, useNavigate} from "@solidjs/router";
import {Component, onCleanup, onMount} from "solid-js";
import {useHelper} from "../../Core/Helper/Helper";
import Str from "../../Core/Helper/Str";
import Url from "../../Core/Helper/Url";


const Authenticated: Component = (props) => {
    const helper = useHelper();
    const id = Str.random();
    const navigate = useNavigate();

    const _ = () => {
        const  tmp = helper.url.current();
        tmp.searchParams.delete('intended');
        return `${Url.front('userLogin')}/?intended=${encodeURIComponent(tmp.toString())}`;
    }

    if ( helper.storage.get('authenticated', '0') !== "1") {
        helper.away(_());
    }

    helper.storage.subscribe(id, (vals) => {
        if( helper.storage.get('authenticated', '0') !== "1")
            helper.away(_());
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