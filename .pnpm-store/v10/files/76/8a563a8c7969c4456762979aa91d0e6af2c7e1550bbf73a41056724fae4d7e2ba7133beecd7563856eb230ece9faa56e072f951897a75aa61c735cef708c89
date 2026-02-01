export declare function CodeAdapter(config: {
    length?: number;
    onCodeRequest: (code: string, claims: Record<string, any>, req: Request) => Promise<Response>;
    onCodeInvalid: (code: string, claims: Record<string, any>, req: Request) => Promise<Response>;
}): (routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
    claims: Record<string, string>;
}>) => void;
