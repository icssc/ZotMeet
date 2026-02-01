import { Handler } from "aws-lambda";
import { Adapter } from "../auth/adapter/adapter.js";
import { AuthHandler } from "../auth/handler.js";
import { SessionBuilder, createSessionBuilder } from "../auth/session.js";
export declare namespace auth {
    type Issuer = import("openid-client").Issuer;
    function authorizer<Providers extends Record<string, Adapter<any>>, Sessions extends SessionBuilder>(...args: Parameters<typeof AuthHandler<Providers, Sessions>>): Handler<any, any>;
    const sessions: typeof createSessionBuilder;
}
