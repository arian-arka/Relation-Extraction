import Api from "./Api";
import Fetch from "./Fetch";
import Response from "./Response";
import Url from "../Helper/Url";
import Config from "../../App/Config";

export class ApiWithCsrf extends Api {
    protected preFetch(props: any): {
        fetch: Fetch;
        body?: (response: Response<any>) => { [p: string]: any };
        headers?: (response: Response<any>) => { [p: string]: any }
    } | void {
        if (['GET', 'HEAD'].includes(props?.method ?? 'GET') || !Config.csrf?.enabled)
            return;

        return {
            fetch: Fetch.url(Url.backWithBase('csrf')).credentials('include'),
            body: Config.csrf?.body,
            headers: Config.csrf?.headers,
        }
    }
}