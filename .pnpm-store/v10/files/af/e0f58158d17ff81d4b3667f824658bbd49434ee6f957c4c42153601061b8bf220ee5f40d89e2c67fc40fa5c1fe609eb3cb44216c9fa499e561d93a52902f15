import { Resource } from "../resource.js";
import { client } from "../aws/client.js";
/**
 * Create a client to interact with the Vector database.
 * @example
 * ```ts title="src/lambda.ts"
 * import { VectorClient } from "sst";
 * const client = VectorClient("MyVectorDB");
 * ```
 *
 * Store a vector into the db
 *
 * ```ts title="src/lambda.ts"
 * await client.put({
 *   vector: [32.4, 6.55, 11.2, 10.3, 87.9],
 *   metadata: { type: "movie", genre: "comedy" },
 * });
 * ```
 *
 * Query vectors that are similar to the given vector
 *
 * ```ts title="src/lambda.ts"
 * const result = await client.query({
 *   vector: [32.4, 6.55, 11.2, 10.3, 87.9],
 *   include: { type: "movie" },
 *   exclude: { genre: "thriller" },
 * });
 * ```
 */
export function VectorClient(name) {
    return {
        put: async (event) => {
            await invokeFunction(
            // @ts-expect-error
            Resource[name].putFunction, JSON.stringify(event), "Failed to store into the vector db");
        },
        query: async (event) => {
            return await invokeFunction(
            // @ts-expect-error
            Resource[name].queryFunction, JSON.stringify(event), "Failed to query the vector db");
        },
        remove: async (event) => {
            await invokeFunction(
            // @ts-expect-error
            Resource[name].removeFunction, JSON.stringify(event), "Failed to remove from the vector db");
        },
    };
}
async function invokeFunction(functionName, body, errorMessage, attempts = 0) {
    try {
        const c = await client();
        const endpoint = `https://lambda.${process.env.AWS_REGION}.amazonaws.com/2015-03-31`;
        const response = await c.fetch(`${endpoint}/functions/${functionName}/invocations`, {
            method: "POST",
            headers: { Accept: "application/json" },
            body,
        });
        // success
        if (response.status === 200 || response.status === 201) {
            if (response.headers.get("content-length") === "0")
                return undefined;
            const text = await response.text();
            try {
                return JSON.parse(text);
            }
            catch (e) {
                throw new Error(`Failed to parse JSON response: ${text}`);
            }
        }
        // error
        const error = new Error();
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            error.name = json.Error?.Code;
            error.message = json.Error?.Message ?? json.message ?? text;
        }
        catch (e) {
            error.message = text;
        }
        error.name = error.name ?? response.headers.get("x-amzn-ErrorType");
        // @ts-expect-error
        error.requestID = response.headers.get("x-amzn-RequestId");
        // @ts-expect-error
        error.statusCode = response.status;
        throw error;
    }
    catch (e) {
        let isRetryable = false;
        // AWS throttling errors => retry
        if ([
            "ThrottlingException",
            "Throttling",
            "TooManyRequestsException",
            "OperationAbortedException",
            "TimeoutError",
            "NetworkingError",
        ].includes(e.name)) {
            isRetryable = true;
        }
        if (!isRetryable)
            throw e;
        // retry
        await new Promise((resolve) => setTimeout(resolve, 1.5 ** attempts * 100 * Math.random()));
        return await invokeFunction(functionName, body, errorMessage, attempts + 1);
    }
}
