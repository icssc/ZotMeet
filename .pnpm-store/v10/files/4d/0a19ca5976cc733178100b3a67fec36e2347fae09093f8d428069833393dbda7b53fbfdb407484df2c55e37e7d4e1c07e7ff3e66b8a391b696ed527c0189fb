import { type OAuth2Tokens } from "../oauth2.js";
export declare class WorkOS {
    private clientId;
    private clientSecret;
    private redirectURI;
    constructor(clientId: string, clientSecret: string | null, redirectURI: string);
    createAuthorizationURL(state: string, codeVerifier: string | null): URL;
    validateAuthorizationCode(code: string, codeVerifier: string | null): Promise<OAuth2Tokens>;
}
