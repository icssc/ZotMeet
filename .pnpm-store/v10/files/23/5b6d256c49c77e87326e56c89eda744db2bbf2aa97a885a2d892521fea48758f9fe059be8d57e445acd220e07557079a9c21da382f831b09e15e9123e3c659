import { OidcBasicConfig } from "./oidc.js";
type MicrosoftConfig = OidcBasicConfig & {
    mode: "oidc";
    prompt?: "login" | "none" | "consent" | "select_account";
    tenantID?: string;
};
export declare function MicrosoftAdapter(config: MicrosoftConfig): (routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
    tokenset: import("openid-client").TokenSet;
    client: import("openid-client").BaseClient;
}>) => Promise<void>;
export {};
