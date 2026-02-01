import type { OAuth2Tokens } from "../oauth2.js";
export declare class Polar {
    private clientId;
    private clientSecret;
    private redirectURI;
    constructor(clientId: string, clientSecret: string | null, redirectURI: string);
    createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL;
    validateAuthorizationCode(code: string, codeVerifier: string): Promise<OAuth2Tokens>;
    refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens>;
    revokeToken(token: string): Promise<void>;
}
