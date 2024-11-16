import {Component} from "solid-js";
import {A} from "@solidjs/router";
import Url from "../../../Core/Helper/Url";
import Lang from "../../../Core/Helper/Lang";

const NotFound : Component = () => {
    return (
        <>
            <section class="bg-white dark:bg-gray-900">
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div class="mx-auto max-w-screen-sm text-center">
                        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
                        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                            {Lang.get('pages.404.missing')}
                        </p>
                        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                            {Lang.get('pages.404.sorry')}
                        </p>
                        <A href={Url.front('userDashboard')} class="inline-flex text-blue-600 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
                            {Lang.get('pages.404.backToDashboard')}
                        </A>
                    </div>
                </div>
            </section>
        </>
    );
}
export default NotFound;