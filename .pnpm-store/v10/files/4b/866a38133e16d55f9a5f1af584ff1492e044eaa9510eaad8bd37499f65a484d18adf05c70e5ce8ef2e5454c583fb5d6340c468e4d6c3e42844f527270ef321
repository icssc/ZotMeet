import { CodeChallengeMethod, OAuth2Client } from "../client.js";
const authorizationEndpoint = "https://discord.com/oauth2/authorize";
const tokenEndpoint = "https://discord.com/api/oauth2/token";
const tokenRevocationEndpoint = "https://discord.com/api/oauth2/token/revoke";
export class Discord {
    client;
    constructor(clientId, clientSecret, redirectURI) {
        this.client = new OAuth2Client(clientId, clientSecret, redirectURI);
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        let url;
        if (codeVerifier !== null) {
            url = this.client.createAuthorizationURLWithPKCE(authorizationEndpoint, state, CodeChallengeMethod.S256, codeVerifier, scopes);
        }
        else {
            url = this.client.createAuthorizationURL(authorizationEndpoint, state, scopes);
        }
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
