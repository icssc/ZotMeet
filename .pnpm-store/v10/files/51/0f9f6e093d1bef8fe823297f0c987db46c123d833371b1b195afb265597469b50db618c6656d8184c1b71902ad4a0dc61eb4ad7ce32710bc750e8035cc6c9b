import { CallToolRequestSchema, InitializeRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
const RequestSchema = z.union([
    InitializeRequestSchema,
    ListToolsRequestSchema,
    CallToolRequestSchema,
]);
export function createMcp(input) {
    return {
        async process(message) {
            const parsed = RequestSchema.parse(message);
            const result = await (async () => {
                if (parsed.method === "initialize")
                    return {
                        protocolVersion: "2024-11-05",
                        capabilities: {
                            tools: {},
                        },
                        serverInfo: {
                            name: "opencontrol",
                            version: "0.0.1",
                        },
                    };
                if (parsed.method === "tools/list") {
                    return {
                        tools: input.tools.map((tool) => ({
                            name: tool.name,
                            inputSchema: tool.args
                                ? zodToJsonSchema(tool.args, "args").definitions["args"]
                                : { type: "object" },
                            description: tool.description,
                        })),
                    };
                }
                if (parsed.method === "tools/call") {
                    const tool = input.tools.find((tool) => tool.name === parsed.params.name);
                    if (!tool)
                        throw new Error("tool not found");
                    let args = parsed.params.arguments;
                    if (tool.args) {
                        const validated = await tool.args["~standard"].validate(args);
                        if (validated.issues) {
                            return {
                                isError: true,
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(validated.issues),
                                    },
                                ],
                            };
                        }
                        args = validated.value;
                    }
                    return tool
                        .run(args)
                        .catch((error) => ({
                        isError: true,
                        content: [
                            {
                                type: "text",
                                text: error.message,
                            },
                        ],
                    }))
                        .then((result) => ({
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    }));
                }
                throw new Error("not implemented");
            })();
            return {
                jsonrpc: "2.0",
                id: message.id,
                result,
            };
        },
    };
}
