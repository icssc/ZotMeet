import { BaseClient, Issuer, TokenSet } from "openid-client";
import { AdapterError } from "./adapter.js";
export interface OauthBasicConfig {
    /**
     * The clientID provided by the third party oauth service
     */
    clientID: string;
    /**
     * The clientSecret provided by the third party oauth service
     */
    clientSecret: string;
    /**
     * Various scopes requested for the access token
     */
    scope: string;
    /**
     * Determines whether users will be prompted for reauthentication and consent
     */
    prompt?: string;
    /**
     * Additional parameters to be passed to the authorization endpoint
     */
    params?: Record<string, string>;
}
export interface OauthConfig extends OauthBasicConfig {
    issuer: Issuer;
}
export declare class OauthError extends AdapterError {
}
export declare const OauthAdapter: (config: OauthConfig) => (routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
    tokenset: TokenSet;
    client: BaseClient;
}>) => Promise<void>;
