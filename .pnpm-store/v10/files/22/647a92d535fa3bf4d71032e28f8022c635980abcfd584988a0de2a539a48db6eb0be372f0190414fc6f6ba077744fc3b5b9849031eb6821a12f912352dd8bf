import type { OAuth2Tokens } from "../oauth2.js";
export declare class Discord {
    private client;
    constructor(clientId: string, clientSecret: string | null, redirectURI: string);
    createAuthorizationURL(state: string, codeVerifier: string | null, scopes: string[]): URL;
    validateAuthorizationCode(code: string, codeVerifier: string | null): Promise<OAuth2Tokens>;
    refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens>;
    revokeToken(token: string): Promise<void>;
}
