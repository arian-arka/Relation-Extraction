import './index.css';
import {render} from 'solid-js/web';
import {Router} from "@solidjs/router";
import App from "./App/App";
import {HelperProvider} from "./Core/Helper/Helper";
import {ToastProvider} from "./Core/Helper/Toast";
import {PromptProvider} from "./Core/Helper/Prompt";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
    );
}


render(() => {
    return (
        <Router>
            <PromptProvider>
                <HelperProvider>
                    <ToastProvider>
                        <App/>
                    </ToastProvider>
                </HelperProvider>
            </PromptProvider>
        </Router>
    );
}, root!);
