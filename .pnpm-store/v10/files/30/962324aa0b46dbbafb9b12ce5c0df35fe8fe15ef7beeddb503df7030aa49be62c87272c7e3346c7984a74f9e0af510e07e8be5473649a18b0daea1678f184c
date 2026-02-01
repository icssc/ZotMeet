import { createS256CodeChallenge } from "../oauth2.js";
import { createOAuth2Request, sendTokenRequest } from "../request.js";
const authorizationEndpoint = "https://auth.mercadopago.com/authorization";
const tokenEndpoint = "https://api.mercadopago.com/oauth/token";
export class MercadoPago {
    clientId;
    clientSecret;
    redirectURI;
    constructor(clientId, clientSecret, redirectURI) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectURI = redirectURI;
    }
    // `scopes` not required since they are defined in the application settings
    createAuthorizationURL(state, codeVerifier) {
        const url = new URL(authorizationEndpoint);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", this.redirectURI);
        url.searchParams.set("state", state);
        const codeChallenge = createS256CodeChallenge(codeVerifier);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("code_challenge", codeChallenge);
        return url;
    }
    async validateAuthorizationCode(code, codeVerifier) {
        const body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", code);
        body.set("redirect_uri", this.redirectURI);
        body.set("code_verifier", codeVerifier);
        body.set("client_id", this.clientId);
        body.set("client_secret", this.clientSecret);
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
    async refreshAccessToken(refreshToken) {
        const body = new URLSearchParams();
        body.set("grant_type", "refresh_token");
        body.set("refresh_token", refreshToken);
        body.set("client_id", this.clientId);
        body.set("client_secret", this.clientSecret);
        const request = createOAuth2Request(tokenEndpoint, body);
        const tokens = await sendTokenRequest(request);
        return tokens;
    }
}
