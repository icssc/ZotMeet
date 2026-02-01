import { CodeChallengeMethod, OAuth2Client } from "../client.js";
import { joinURIAndPath } from "../request.js";
export class Synology {
    authorizationEndpoint;
    tokenEndpoint;
    client;
    constructor(baseURL, applicationId, applicationSecret, redirectURI) {
        this.authorizationEndpoint = joinURIAndPath(baseURL, "/webman/sso/SSOOauth.cgi");
        this.tokenEndpoint = joinURIAndPath(baseURL, "/webman/sso/SSOAccessToken.cgi");
        this.client = new OAuth2Client(applicationId, applicationSecret, redirectURI);
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        const url = this.client.createAuthorizationURLWithPKCE(this.authorizationEndpoint, state, CodeChallengeMethod.S256, codeVerifier, scopes);
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const tokens = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, codeVerifier);
        return tokens;
    }
}
