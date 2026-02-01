import { createOAuth2Request, sendTokenRequest, sendTokenRevocationRequest } from "../request.js";
import { createS256CodeChallenge } from "../oauth2.js";
const authorizationEndpoint = "https://id.kick.com/oauth/authorize";
const tokenEndpoint = "https://id.kick.com/oauth/token";
const tokenRevocationEndpoint = "https://id.kick.com/oauth/revoke";
export class Kick {
    clientId;
    clientSecret;
    redirectURI;
    constructor(clientId, clientSecret, redirectURI) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectURI = redirectURI;
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        const url = new URL(authorizationEndpoint);
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("redirect_uri", this.redirectURI);
        url.searchParams.set("state", state);
        if (scopes.length > 0) {
            url.searchParams.set("scope", scopes.join(" "));
        }
        const codeChallenge = createS256CodeChallenge(codeVerifier);
        url.searchParams.set("code_challenge", codeChallenge);
        url.searchParams.set("code_challenge_method", "S256");
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const body = new URLSearchParams();
        body.set("code", code);
        body.set("client_id", this.clientId);
        body.set("client_secret", this.clientSecret);
        body.set("redirect_uri", this.redirectURI);
        body.set("grant_type", "authorization_code");
        body.set("code_verifier", codeVerifier);
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async refreshAccessToken(refreshToken) {
        const body = new URLSearchParams();
        body.set("refresh_token", refreshToken);
        body.set("client_id", this.clientId);
        body.set("client_secret", this.clientSecret);
        body.set("grant_type", "refresh_token");
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async revokeToken(token) {
        const body = new URLSearchParams();
        body.set("token", token);
        const request = createOAuth2Request(tokenRevocationEndpoint, body);
        await sendTokenRevocationRequest(request);
    }
}
