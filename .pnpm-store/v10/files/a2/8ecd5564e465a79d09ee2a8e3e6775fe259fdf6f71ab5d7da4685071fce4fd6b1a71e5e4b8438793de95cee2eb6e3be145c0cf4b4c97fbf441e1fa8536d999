import { createS256CodeChallenge } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest, sendTokenRevocationRequest } from "../request.js";
const authorizationEndpoint = "https://www.tiktok.com/v2/auth/authorize";
const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
const tokenRevocationEndpoint = "https://open.tiktokapis.com/v2/oauth/revoke/";
export class TikTok {
    clientKey;
    clientSecret;
    redirectURI;
    constructor(clientKey, clientSecret, redirectURI) {
        this.clientKey = clientKey;
        this.clientSecret = clientSecret;
        this.redirectURI = redirectURI;
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        const url = new URL(authorizationEndpoint);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_key", this.clientKey);
        url.searchParams.set("state", state);
        const codeChallenge = createS256CodeChallenge(codeVerifier);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("code_challenge", codeChallenge);
        if (scopes.length > 0) {
            url.searchParams.set("scope", scopes.join(","));
        }
        url.searchParams.set("redirect_uri", this.redirectURI);
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", code);
        body.set("redirect_uri", this.redirectURI);
        body.set("code_verifier", codeVerifier);
        body.set("client_key", this.clientKey);
        body.set("client_secret", this.clientSecret);
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async refreshAccessToken(refreshToken) {
        const body = new URLSearchParams();
        body.set("grant_type", "refresh_token");
        body.set("refresh_token", refreshToken);
        body.set("client_key", this.clientKey);
        body.set("client_secret", this.clientSecret);
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async revokeToken(token) {
        const body = new URLSearchParams();
        body.set("token", token);
        body.set("client_key", this.clientKey);
        body.set("client_secret", this.clientSecret);
        const request = createOAuth2Request(tokenRevocationEndpoint, body);
        await sendTokenRevocationRequest(request);
    }
}
