import { z } from "zod";
/**
 * A list of OpenControl tools provided by SST. Currently, it includes tools that
 * can:
 *
 * - Lists the resources in your SST app.
 * - Access the resources in your AWS account.
 *
 * You can add this tool to your OpenControl server by passing it to the `tools`
 * option when creating it.
 *
 * @example
 * ```js title="src/server.ts"
 * import { create } from "opencontrol";
 * import { tools } from "sst/opencontrol";
 *
 * const app = create({
 *   model: // ...
 *   tools: [...tools]
 * });
 * ```
 */
export declare const tools: import("opencontrol/tool").Tool<z.ZodObject<{
    service: z.ZodString;
    method: z.ZodString;
    params: z.ZodString;
}, "strip", z.ZodTypeAny, {
    method: string;
    params: string;
    service: string;
}, {
    method: string;
    params: string;
    service: string;
}>>[];
