export * from "./session.js";
export * from "./handler.js";
export { Issuer } from "openid-client";
import { AuthHandler } from "./handler.js";
import { createSessionBuilder } from "./session.js";
export var auth;
(function (auth) {
    auth.authorizer = AuthHandler;
    auth.sessions = createSessionBuilder;
})(auth || (auth = {}));
