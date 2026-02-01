import { Issuer } from "openid-client";
import { OidcAdapter } from "./oidc.js";
import { OauthAdapter } from "./oauth.js";
const issuer = await Issuer.discover("https://accounts.google.com");
export function GoogleAdapter(config) {
    /* @__PURE__ */
    if (config.mode === "oauth") {
        return OauthAdapter({
            issuer,
            ...config,
            params: {
                ...(config.accessType && { access_type: config.accessType }),
                ...config.params,
            },
        });
    }
    return OidcAdapter({
        issuer,
        scope: "openid email profile",
        ...config,
    });
}
