import { OidcBasicConfig } from "./oidc.js";
import { OauthBasicConfig } from "./oauth.js";
type GooglePrompt = "none" | "consent" | "select_account";
type GoogleAccessType = "offline" | "online";
type GoogleConfig = (OauthBasicConfig & {
    mode: "oauth";
    prompt?: GooglePrompt;
    accessType?: GoogleAccessType;
}) | (OidcBasicConfig & {
    mode: "oidc";
    prompt?: GooglePrompt;
});
export declare function GoogleAdapter(config: GoogleConfig): (routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
    tokenset: import("openid-client").TokenSet;
    client: import("openid-client").BaseClient;
}>) => Promise<void>;
export {};
