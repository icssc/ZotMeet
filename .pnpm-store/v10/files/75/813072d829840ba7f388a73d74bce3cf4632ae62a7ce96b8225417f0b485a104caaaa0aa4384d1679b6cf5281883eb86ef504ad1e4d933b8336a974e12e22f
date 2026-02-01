import { CodeChallengeMethod, OAuth2Client } from "../client.js";
const authorizationEndpoint = "https://developer.api.autodesk.com/authentication/v2/authorize";
const tokenEndpoint = "https://developer.api.autodesk.com/authentication/v2/token";
const tokenRevocationEndpoint = "https://developer.api.autodesk.com/authentication/v2/revoke";
export class Autodesk {
    client;
    constructor(clientId, clientSecret, redirectURI) {
        this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        const url = this.client.createAuthorizationURLWithPKCE(authorizationEndpoint, state, CodeChallengeMethod.S256, codeVerifier, scopes);
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
    async revokeToken(token) {
        await this.client.revokeToken(tokenRevocationEndpoint, token);
    }
}
