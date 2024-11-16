import {CsrfMiddleware} from "../App/Global/Global.middleware";

import sensible from "./sensible"
import support from "./support"
import cors from "./cors"
import cookie from "./cookie"
import csrf from "./csrf"
import errorHandler from "./errorHandler"
import helmet from "./helmet";
import jwt from "./jwt";
import mongoose from "./mongoose";
import _static from "./static";

export const plugins = [
    sensible,
    support,
    cors,
    helmet,
    cookie,
    csrf,
    jwt,
    mongoose,
    errorHandler,
    _static,
];

export const globalMiddlewares: (Function)[] = [
    CsrfMiddleware,
];