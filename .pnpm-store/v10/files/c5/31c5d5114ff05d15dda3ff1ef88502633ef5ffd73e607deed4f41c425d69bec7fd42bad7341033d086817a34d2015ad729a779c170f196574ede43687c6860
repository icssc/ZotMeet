import { ArcticFetchError, createOAuth2Request, createOAuth2RequestError, encodeBasicCredentials, UnexpectedErrorResponseBodyError, UnexpectedResponseError } from "../request.js";
import { OAuth2Tokens } from "../oauth2.js";
const authorizationEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";
export class GitHub {
    clientId;
    clientSecret;
    redirectURI;
    constructor(clientId, clientSecret, redirectURI) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectURI = redirectURI;
    }
    createAuthorizationURL(state, scopes) {
        const url = new URL(authorizationEndpoint);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("state", state);
        if (scopes.length > 0) {
            url.searchParams.set("scope", scopes.join(" "));
        }
        if (this.redirectURI !== null) {
            url.searchParams.set("redirect_uri", this.redirectURI);
        }
        return url;
    }
    async validateAuthorizationCode(code) {
        const body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", code);
        if (this.redirectURI !== null) {
            body.set("redirect_uri", this.redirectURI);
        }
        const request = createOAuth2Request(tokenEndpoint, body);
        const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
        request.headers.set("Authorization", `Basic ${encodedCredentials}`);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async refreshAccessToken(refreshToken) {
        const body = new URLSearchParams();
        body.set("grant_type", "refresh_token");
        body.set("refresh_token", refreshToken);
        const request = createOAuth2Request(tokenEndpoint, body);
        const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret);
        request.headers.set("Authorization", `Basic ${encodedCredentials}`);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
}
async function sendTokenRequest(request) {
    let response;
    try {
        response = await fetch(request);
    }
    catch (e) {
        throw new ArcticFetchError(e);
    }
    if (response.status !== 200) {
        if (response.body !== null) {
            await response.body.cancel();
        }
        throw new UnexpectedResponseError(response.status);
    }
    let data;
    try {
        data = await response.json();
    }
    catch {
        throw new UnexpectedResponseError(response.status);
    }
    if (typeof data !== "object" || data === null) {
        throw new UnexpectedErrorResponseBodyError(response.status, data);
    }
    if ("error" in data && typeof data.error === "string") {
        let error;
        try {
            error = createOAuth2RequestError(data);
        }
        catch {
            throw new UnexpectedErrorResponseBodyError(response.status, data);
        }
        throw error;
    }
    const tokens = new OAuth2Tokens(data);
    return tokens;
}
