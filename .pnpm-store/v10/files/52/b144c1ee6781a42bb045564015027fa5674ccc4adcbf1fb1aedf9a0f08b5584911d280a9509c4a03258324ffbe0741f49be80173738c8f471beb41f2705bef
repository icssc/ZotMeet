import { JSONRPCRequest } from "@modelcontextprotocol/sdk/types.js";
import { Tool } from "./tool.js";
export declare function createMcp(input: {
    tools: Tool[];
}): {
    process(message: JSONRPCRequest): Promise<{
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
            tools?: undefined;
            isError?: undefined;
            content?: undefined;
        } | {
            tools: {
                name: string;
                inputSchema: any;
                description: string;
            }[];
            protocolVersion?: undefined;
            capabilities?: undefined;
            serverInfo?: undefined;
            isError?: undefined;
            content?: undefined;
        } | {
            isError: true;
            content: {
                type: "text";
                text: string;
            }[];
            protocolVersion?: undefined;
            capabilities?: undefined;
            serverInfo?: undefined;
            tools?: undefined;
        };
    }>;
};
