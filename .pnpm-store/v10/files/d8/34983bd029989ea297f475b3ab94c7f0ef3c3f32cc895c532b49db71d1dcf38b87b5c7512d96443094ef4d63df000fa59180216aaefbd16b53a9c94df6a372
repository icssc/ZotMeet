import { createS256CodeChallenge } from "../oauth2.js";
import { createOAuth2Request, encodeBasicCredentials, joinURIAndPath, sendTokenRequest } from "../request.js";
export class MicrosoftEntraId {
    authorizationEndpoint;
    tokenEndpoint;
    clientId;
    clientSecret;
    redirectURI;
    constructor(tenant, clientId, clientSecret, redirectURI) {
        this.authorizationEndpoint = joinURIAndPath("https://login.microsoftonline.com", tenant, "/oauth2/v2.0/authorize");
        this.tokenEndpoint = joinURIAndPath("https://login.microsoftonline.com", tenant, "/oauth2/v2.0/token");
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectURI = redirectURI;
    }
    createAuthorizationURL(state, codeVerifier, scopes) {
        const url = new URL(this.authorizationEndpoint);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", this.redirectURI);
        url.searchParams.set("state", state);
        const codeChallenge = createS256CodeChallenge(codeVerifier);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("code_challenge", codeChallenge);
        if (scopes.length > 0) {
            url.searchParams.set("scope", scopes.join(" "));
        }
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", code);
        body.set("redirect_uri", this.redirectURI);
        body.set("code_verifier", codeVerifier);
        if (this.clientSecret === null) {
            body.set("client_id", this.clientId);
        }
        const request = createOAuth2Request(this.tokenEndpoint, body);
        if (this.clientSecret !== null) {
            const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
            request.headers.set("Authorization", `Basic ${encodedCredentials}`);
        }
        else {
            // Origin header required for public clients. Value can be anything.
            request.headers.set("Origin", "arctic");
        }
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async refreshAccessToken(refreshToken, scopes) {
        const body = new URLSearchParams();
        body.set("grant_type", "refresh_token");
        body.set("refresh_token", refreshToken);
        if (this.clientSecret === null) {
            body.set("client_id", this.clientId);
        }
        if (scopes.length > 0) {
            body.set("scope", scopes.join(" "));
        }
        const request = createOAuth2Request(this.tokenEndpoint, body);
        if (this.clientSecret !== null) {
            const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
            request.headers.set("Authorization", `Basic ${encodedCredentials}`);
        }
        else {
            // Origin header required for public clients. Value can be anything.
            request.headers.set("Origin", "arctic");
        }
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
}
