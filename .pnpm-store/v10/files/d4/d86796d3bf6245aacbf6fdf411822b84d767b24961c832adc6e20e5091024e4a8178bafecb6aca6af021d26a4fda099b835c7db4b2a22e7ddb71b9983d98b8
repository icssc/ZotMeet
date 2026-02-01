import { SignJWT, jwtVerify } from "jose";
export function LinkAdapter(config) {
    return function (routes, ctx) {
        routes.get("/authorize", async (c) => {
            const token = await new SignJWT(c.req.query())
                .setProtectedHeader({ alg: ctx.algorithm })
                .setExpirationTime("10m")
                .sign(await ctx.signing.privateKey());
            const url = new URL(new URL(c.req.url).origin);
            url.pathname = `/${ctx.name}/callback`;
            for (const key of url.searchParams.keys()) {
                url.searchParams.delete(key);
            }
            url.searchParams.set("token", token);
            const resp = ctx.forward(c, await config.onLink(url.toString(), c.req.query()));
            return resp;
        });
        routes.get("/callback", async (c) => {
            const token = c.req.query("token");
            if (!token)
                throw new Error("Missing token parameter");
            const verified = await jwtVerify(token, await ctx.signing.publicKey());
            const resp = await ctx.success(c, { claims: verified.payload });
            return resp;
        });
    };
}
