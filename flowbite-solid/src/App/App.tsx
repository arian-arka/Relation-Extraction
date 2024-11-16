import {Component} from 'solid-js';
import {Route, Routes} from "@solidjs/router";
import 'flowbite';
import Layout from './Layout/Layout';
import UserLoginPage from "./Page/User/UserLoginPage";
import Test from "./Page/Test";
import Authenticated from "./Component/Authenticated";
import Url from "../Core/Helper/Url";
import UnAuthenticated from "./Component/UnAuthenticated";
import NotFound from "./Page/Error/NotFound";
import UserStorePage from "./Page/User/UserStorePage";
import UserProfilePage from "./Page/User/UserProfilePage";
import UserDashboardPage from './Page/User/UserDashboardPage';
import UserUpdatePage from "./Page/User/UserUpdatePage";
import UserListPage from "./Page/User/UserListPage";
import {ToastProvider} from "../Core/Helper/Toast";
import RelationStorePage from "./Page/Relation/RelationStorePage";
import RelationUpdatePage from "./Page/Relation/RelationUpdatePage";
import RelationListPage from "./Page/Relation/RelationListPage";
import SentenceStorePage from "./Page/Sentence/SentenceStorePage";
import SentenceUpdatePage from "./Page/Sentence/SentenceUpdatePage";
import SentenceListPage from "./Page/Sentence/SentenceListPage";
import Config from "./Config";
import Lang from "../Core/Helper/Lang";
import Html from "../Core/Helper/Html";
import {useHelper} from "../Core/Helper/Helper";
import SentenceTagPage from "./Page/Sentence/SentenceTagPage";


const App: Component = () => {
    const helper = useHelper();

    if(!(!!helper.storage.get('lang',null))){
        helper.storage.set('dir',Config.default.dir);
        helper.storage.set('lang',Config.default.lang);
    }
    Lang.setLang(helper.storage.get('lang'));

    Html.setDir(helper.storage.get('dir'));

    return (
        <>
            <Routes>
                <Route path="/" component={Authenticated}>


                        <Route path="/" component={Layout}>
                            <Route path="/user/dashboard" component={UserDashboardPage}/>
                            <Route path="/user/list" component={UserListPage}/>
                            <Route path="/user/store" component={UserStorePage}/>
                            <Route path="/user/profile" component={UserProfilePage}/>
                            <Route path="/user/update/:user" component={UserUpdatePage}/>

                            <Route path="/relation/list" component={RelationListPage}/>
                            <Route path="/relation/store" component={RelationStorePage}/>
                            <Route path="/relation/update/:relation" component={RelationUpdatePage}/>

                            <Route path="/sentence/list" component={SentenceListPage}/>
                            <Route path="/sentence/store" component={SentenceStorePage}/>
                            <Route path="/sentence/update/:sentence" component={SentenceUpdatePage}/>
                            <Route path="/sentence/tag/:sentence" component={SentenceTagPage}/>
                            <Route path="/" component={UserDashboardPage}/>
                        </Route>
                </Route>
                <Route path="/" component={UnAuthenticated}>
                    <Route path={Url.front('userLogin')} component={UserLoginPage}/>

                </Route>
                <Route path="/*" component={NotFound}/>
            </Routes>
        </>
    );
};

export default App;
