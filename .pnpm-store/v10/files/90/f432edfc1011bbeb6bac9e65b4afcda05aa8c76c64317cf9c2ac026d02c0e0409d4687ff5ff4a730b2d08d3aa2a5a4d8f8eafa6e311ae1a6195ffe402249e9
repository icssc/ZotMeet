import type { OAuth2Tokens } from "../oauth2.js";
export declare class Gitea {
    private authorizationEndpoint;
    private tokenEndpoint;
    private client;
    constructor(baseURL: string, clientId: string, clientSecret: string | null, redirectURI: string);
    createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL;
    validateAuthorizationCode(code: string, codeVerifier: string): Promise<OAuth2Tokens>;
    refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens>;
}
