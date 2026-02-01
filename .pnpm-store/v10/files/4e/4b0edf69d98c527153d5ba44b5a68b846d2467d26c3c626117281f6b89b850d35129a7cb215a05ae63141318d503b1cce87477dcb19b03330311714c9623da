import { Adapter } from "./adapter/adapter.js";
import { JWTPayload } from "jose";
import { SessionBuilder } from "./session.js";
export interface OnSuccessResponder<T extends {
    type: any;
    properties: any;
}> {
    session(input: T & JWTPayload): Promise<Response>;
}
export declare class UnknownProviderError extends Error {
    provider?: string | undefined;
    constructor(provider?: string | undefined);
}
export declare class MissingParameterError extends Error {
    parameter: string;
    constructor(parameter: string);
}
export declare class UnknownStateError extends Error {
    constructor();
}
export declare class UnauthorizedClientError extends Error {
    client: string;
    redirect_uri: string;
    constructor(client: string, redirect_uri: string);
}
export declare class InvalidSessionError extends Error {
    constructor();
}
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
export declare const aws: <E extends import("hono").Env = import("hono").Env, S extends import("hono").Schema = {}, BasePath extends string = "/">(app: import("hono").Hono<E, S, BasePath>) => (event: import("hono/aws-lambda").LambdaEvent, lambdaContext?: import("hono/aws-lambda").LambdaContext) => Promise<import("hono/aws-lambda").APIGatewayProxyResult>;
export declare function AuthHandler<Providers extends Record<string, Adapter<any>>, Sessions extends SessionBuilder = SessionBuilder, Result = {
    [key in keyof Providers]: Prettify<{
        provider: key;
    } & (Providers[key] extends Adapter<infer T> ? T : {})>;
}[keyof Providers]>(input: {
    basePath?: string;
    stream?: boolean;
    session?: Sessions;
    providers: Providers;
    callbacks: {
        index?(req: Request): Promise<Response>;
        error?(error: UnknownStateError, req: Request): Promise<Response | undefined>;
        auth: {
            error?(error: MissingParameterError | UnauthorizedClientError | UnknownProviderError, req: Request): Promise<Response>;
            start?(event: Request): Promise<void>;
            allowClient(clientID: string, redirect: string, req: Request): Promise<boolean>;
            success(response: OnSuccessResponder<Sessions["$typeValues"]>, input: Result, req: Request): Promise<Response>;
        };
        connect?: {
            error?(error: InvalidSessionError | UnknownProviderError, req: Request): Promise<Response | undefined>;
            start?(session: Sessions["$typeValues"], req: Request): Promise<void>;
            success?(session: Sessions["$typeValues"], input: {}): Promise<Response>;
        };
    };
}): import("hono/hono-base").HonoBase<import("hono").Env, import("hono/types").BlankSchema, string>;
