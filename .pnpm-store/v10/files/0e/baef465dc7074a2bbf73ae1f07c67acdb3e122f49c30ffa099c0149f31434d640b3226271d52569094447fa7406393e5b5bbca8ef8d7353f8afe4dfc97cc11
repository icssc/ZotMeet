import type { OAuth2Tokens } from "../oauth2.js";
export declare class MercadoLibre {
    clientId: string;
    private clientSecret;
    private redirectURI;
    constructor(clientId: string, clientSecret: string, redirectURI: string);
    createAuthorizationURL(state: string, codeVerifier: string): URL;
    validateAuthorizationCode(code: string, codeVerifier: string): Promise<OAuth2Tokens>;
    refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens>;
}
