import { BaseClient, Issuer, TokenSet } from "openid-client";
export interface OidcBasicConfig {
    /**
     * The clientID provided by the third party oauth service
     */
    clientID: string;
    /**
     * Determines whether users will be prompted for reauthentication and consent
     */
    prompt?: string;
}
export interface OidcConfig extends OidcBasicConfig {
    issuer: Issuer;
    scope: string;
}
export declare const OidcAdapter: (config: OidcConfig) => (routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
    tokenset: TokenSet;
    client: BaseClient;
}>) => Promise<void>;
