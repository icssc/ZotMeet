import { Issuer } from "openid-client";
import { OidcAdapter } from "./oidc.js";
export function MicrosoftAdapter(config) {
    const authority = config?.tenantID ?? "common";
    const issuer = `https://login.microsoftonline.com/${authority}`;
    return OidcAdapter({
        issuer: new Issuer({
            issuer: `${issuer}/v2.0`,
            authorization_endpoint: `${issuer}/oauth2/v2.0/authorize`,
            token_endpoint: `${issuer}/oauth2/v2.0/token`,
            jwks_uri: `${issuer}/discovery/v2.0/keys`,
        }),
        scope: "openid email profile",
        ...config,
    });
}
