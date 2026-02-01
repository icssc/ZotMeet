import { createOAuth2Request, sendTokenRequest } from "../request.js";
import { createS256CodeChallenge } from "../oauth2.js";
const authorizationEndpoint = "https://api.workos.com/sso/authorize";
const tokenEndpoint = "https://api.workos.com/sso/token";
export class WorkOS {
    clientId;
    clientSecret;
    redirectURI;
    constructor(clientId, clientSecret, redirectURI) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectURI = redirectURI;
    }
    createAuthorizationURL(state, codeVerifier) {
        const url = new URL(authorizationEndpoint);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("state", state);
        url.searchParams.set("redirect_uri", this.redirectURI);
        if (codeVerifier !== null) {
            const codeChallenge = createS256CodeChallenge(codeVerifier);
            url.searchParams.set("code_challenge_method", "S256");
            url.searchParams.set("code_challenge", codeChallenge);
        }
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", code);
        body.set("redirect_uri", this.redirectURI);
        body.set("client_id", this.clientId);
        if (this.clientSecret !== null) {
            body.set("client_secret", this.clientSecret);
        }
        if (codeVerifier !== null) {
            body.set("code_verifier", codeVerifier);
        }
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
}
