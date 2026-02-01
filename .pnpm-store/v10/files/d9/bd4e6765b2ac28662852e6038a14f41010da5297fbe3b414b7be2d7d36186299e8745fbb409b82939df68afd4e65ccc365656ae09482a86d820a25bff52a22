import { OAuth2Client, CodeChallengeMethod } from "../client.js";
const authorizationEndpoint = "https://myanimelist.net/v1/oauth2/authorize";
const tokenEndpoint = "https://myanimelist.net/v1/oauth2/token";
export class MyAnimeList {
    client;
    constructor(clientId, clientSecret, redirectURI) {
        this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
    }
    createAuthorizationURL(state, codeVerifier) {
        const url = this.client.createAuthorizationURLWithPKCE(authorizationEndpoint, state, CodeChallengeMethod.Plain, codeVerifier, []);
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const tokens = await this.client.validateAuthorizationCode(tokenEndpoint, code, codeVerifier);
        return tokens;
    }
    async refreshAccessToken(refreshToken) {
        const tokens = await this.client.refreshAccessToken(tokenEndpoint, refreshToken, []);
        return tokens;
    }
}
