import { CodeChallengeMethod, OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";
export class Authentik {
    authorizationEndpoint;
    tokenEndpoint;
    tokenRevocationEndpoint;
    client;
    constructor(baseURL, clientId, clientSecret, redirectURI) {
        this.authorizationEndpoint = joinURIAndPath(baseURL, "/application/o/authorize/");
        this.tokenEndpoint = joinURIAndPath(baseURL, "/application/o/token/");
        this.tokenRevocationEndpoint = joinURIAndPath(baseURL, "/application/o/revoke/");
        this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        const url = this.client.createAuthorizationURLWithPKCE(this.authorizationEndpoint, state, CodeChallengeMethod.S256, codeVerifier, scopes);
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const tokens = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, codeVerifier);
        return tokens;
    }
    async refreshAccessToken(refreshToken) {
        const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, []);
        return tokens;
    }
    async revokeToken(token) {
        await this.client.revokeToken(this.tokenRevocationEndpoint, token);
    }
}
