import { Tool } from "./tool.js";
export interface OpenControlOptions {
    key?: string;
}
export declare function create(input: {
    tools: Tool[];
    key?: string;
}): import("hono/hono-base").HonoBase<import("hono/types").BlankEnv, import("hono/types").BlankSchema | import("hono/types").MergeSchemaPath<{
    "/mcp": {
        $post: {
            input: {};
            output: {
                jsonrpc: "2.0";
                id: string | number;
                result: {
                    content: {
                        type: "text";
                        text: string;
                    }[];
                } | {
                    protocolVersion: string;
                    capabilities: {
                        tools: {};
                    };
                    serverInfo: {
                        name: string;
                        version: string;
                    };
                } | {
                    tools: {
                        name: string;
                        inputSchema: any;
                        description: string;
                    }[];
                } | {
                    isError: true;
                    content: {
                        type: "text";
                        text: string;
                    }[];
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, ":key">, "/">;
