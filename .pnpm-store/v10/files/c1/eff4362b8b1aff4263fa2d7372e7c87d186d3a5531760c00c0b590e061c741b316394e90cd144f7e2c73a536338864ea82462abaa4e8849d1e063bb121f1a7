import { AuthHandler } from "../auth/handler.js";
import { createSessionBuilder } from "../auth/session.js";
import { handle, streamHandle } from "hono/aws-lambda";
export var auth;
(function (auth) {
    function authorizer(...args) {
        const hono = AuthHandler(...args);
        return (args[0].stream ? streamHandle(hono) : handle(hono));
    }
    auth.authorizer = authorizer;
    auth.sessions = createSessionBuilder;
})(auth || (auth = {}));
