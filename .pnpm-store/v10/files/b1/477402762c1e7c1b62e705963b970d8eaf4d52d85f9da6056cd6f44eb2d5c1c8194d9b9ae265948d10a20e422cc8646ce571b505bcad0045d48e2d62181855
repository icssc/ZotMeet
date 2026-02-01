import { OAuth2Tokens } from "./oauth2.js";
export declare function joinURIAndPath(base: string, ...path: string[]): string;
export declare function createOAuth2Request(endpoint: string, body: URLSearchParams): Request;
export declare function encodeBasicCredentials(username: string, password: string): string;
export declare function sendTokenRequest(request: Request): Promise<OAuth2Tokens>;
export declare function sendTokenRevocationRequest(request: Request): Promise<void>;
export declare function createOAuth2RequestError(result: object): OAuth2RequestError;
export declare class ArcticFetchError extends Error {
    constructor(cause: unknown);
}
export declare class OAuth2RequestError extends Error {
    code: string;
    description: string | null;
    uri: string | null;
    state: string | null;
    constructor(code: string, description: string | null, uri: string | null, state: string | null);
}
export declare class UnexpectedResponseError extends Error {
    status: number;
    constructor(responseStatus: number);
}
export declare class UnexpectedErrorResponseBodyError extends Error {
    status: number;
    data: unknown;
    constructor(status: number, data: unknown);
}
