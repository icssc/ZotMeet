import { OauthBasicConfig } from "./oauth.js";
/**
 * The Spotify Adapter follows the PKCE flow outlined here:
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *
 * List of scopes available:
 * https://developer.spotify.com/documentation/web-api/concepts/scopes
 */
export declare const SpotifyAdapter: (config: OauthBasicConfig) => (routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
    tokenset: import("openid-client").TokenSet;
    client: import("openid-client").BaseClient;
}>) => Promise<void>;
