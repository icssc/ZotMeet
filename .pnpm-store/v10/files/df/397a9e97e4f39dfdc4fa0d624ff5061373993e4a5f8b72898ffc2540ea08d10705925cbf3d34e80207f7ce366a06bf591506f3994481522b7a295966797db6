import { createS256CodeChallenge } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest, sendTokenRevocationRequest } from "../request.js";
const authorizationEndpoint = "https://polar.sh/oauth2/authorize";
const tokenEndpoint = "https://api.polar.sh/v1/oauth2/token";
const tokenRevocationEndpoint = "https://api.polar.sh/v1/oauth2/revoke";
// Polar.sh supports HTTP Basic Auth but `client_secret` is set as the default authentication method.
export class Polar {
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
        if (this.clientSecret !== null) {
            body.set("client_secret", this.clientSecret);
        }
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
        if (this.clientSecret !== null) {
            body.set("client_secret", this.clientSecret);
        }
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
