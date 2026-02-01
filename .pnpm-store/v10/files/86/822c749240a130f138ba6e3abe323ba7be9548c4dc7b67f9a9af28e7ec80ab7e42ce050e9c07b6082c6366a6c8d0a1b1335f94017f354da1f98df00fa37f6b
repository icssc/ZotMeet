import { generators } from "openid-client";
import { getCookie } from "hono/cookie";
export const OidcAdapter = /* @__PURE__ */ (config) => {
    return async function (routes, ctx) {
        routes.get("/authorize", async (c) => {
            const callback = new URL(c.req.url);
            callback.pathname = callback.pathname.replace(/authorize.*$/, "callback");
            callback.search = "";
            callback.host = c.req.header("x-forwarded-host") || callback.host;
            const client = new config.issuer.Client({
                client_id: config.clientID,
                redirect_uris: [callback.toString()],
                response_types: ["id_token"],
            });
            const nonce = generators.nonce();
            const state = generators.state();
            const url = client.authorizationUrl({
                scope: config.scope,
                response_mode: "form_post",
                nonce,
                state,
                prompt: config.prompt,
            });
            ctx.cookie(c, "auth_nonce", nonce, 60 * 10);
            ctx.cookie(c, "auth_state", state, 60 * 10);
            return c.redirect(url);
        });
        routes.post("/callback", async (c) => {
            const callback = c.req.url.replace(/authorize\/.*$/, "callback");
            const client = new config.issuer.Client({
                client_id: config.clientID,
                redirect_uris: [callback],
                response_types: ["id_token"],
            });
            const form = await c.req.formData();
            const nonce = getCookie(c, "auth_nonce");
            const state = getCookie(c, "auth_state");
            const tokenset = await client.callback(callback, Object.fromEntries(form), {
                nonce,
                state,
            });
            return ctx.success(c, {
                tokenset,
                client,
            });
        });
    };
};
