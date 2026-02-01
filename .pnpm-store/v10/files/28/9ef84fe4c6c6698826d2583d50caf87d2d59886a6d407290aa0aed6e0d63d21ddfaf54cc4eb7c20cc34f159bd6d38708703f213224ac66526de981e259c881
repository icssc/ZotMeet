import { OAuth2Client, CodeChallengeMethod } from "../client.js";
import { joinURIAndPath } from "../request.js";
export class Mastodon {
    authorizationEndpoint;
    tokenEndpoint;
    tokenRevocationEndpoint;
    client;
    constructor(baseURL, clientId, clientSecret, redirectURI) {
        this.authorizationEndpoint = joinURIAndPath(baseURL, "/api/v1/oauth/authorize");
        this.tokenEndpoint = joinURIAndPath(baseURL, "/api/v1/oauth/token");
        this.tokenRevocationEndpoint = joinURIAndPath(baseURL, "/api/v1/oauth/revoke");
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
    async revokeToken(token) {
        await this.client.revokeToken(this.tokenRevocationEndpoint, token);
    }
}
