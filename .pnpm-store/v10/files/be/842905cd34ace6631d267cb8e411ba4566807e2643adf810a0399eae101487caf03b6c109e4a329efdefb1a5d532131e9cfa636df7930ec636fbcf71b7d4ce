import { CodeChallengeMethod, OAuth2Client } from "../client.js";
export class AmazonCognito {
    authorizationEndpoint;
    tokenEndpoint;
    tokenRevocationEndpoint;
    client;
    constructor(domain, clientId, clientSecret, redirectURI) {
        this.authorizationEndpoint = `https://${domain}/oauth2/authorize`;
        this.tokenEndpoint = `https://${domain}/oauth2/token`;
        this.tokenRevocationEndpoint = `https://${domain}/oauth2/revoke`;
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
    async refreshAccessToken(refreshToken, scopes) {
        const tokens = await this.client.refreshAccessToken(this.tokenEndpoint, refreshToken, scopes);
        return tokens;
    }
    async revokeToken(token) {
        await this.client.revokeToken(this.tokenRevocationEndpoint, token);
    }
}
