import { OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";
export class GitLab {
    authorizationEndpoint;
    tokenEndpoint;
    tokenRevocationEndpoint;
    client;
    constructor(baseURL, clientId, clientSecret, redirectURI) {
        this.authorizationEndpoint = joinURIAndPath(baseURL, "/oauth/authorize");
        this.tokenEndpoint = joinURIAndPath(baseURL, "/oauth/token");
        this.tokenRevocationEndpoint = joinURIAndPath(baseURL, "/oauth/revoke");
        this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
    }
    createAuthorizationURL(state, scopes) {
        const url = this.client.createAuthorizationURL(this.authorizationEndpoint, state, scopes);
        return url;
    }
    async validateAuthorizationCode(code) {
        const tokens = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, null);
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
