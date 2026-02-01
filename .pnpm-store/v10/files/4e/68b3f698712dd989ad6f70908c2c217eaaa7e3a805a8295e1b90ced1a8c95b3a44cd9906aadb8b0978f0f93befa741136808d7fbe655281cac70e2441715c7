import { Issuer } from "openid-client";
import { OauthAdapter } from "./oauth.js";
const issuer = new Issuer({
    issuer: "https://github.com",
    authorization_endpoint: "https://github.com/login/oauth/authorize",
    token_endpoint: "https://github.com/login/oauth/access_token",
});
export const GithubAdapter = 
/* @__PURE__ */
(config) => {
    return OauthAdapter({
        issuer,
        ...config,
    });
};
