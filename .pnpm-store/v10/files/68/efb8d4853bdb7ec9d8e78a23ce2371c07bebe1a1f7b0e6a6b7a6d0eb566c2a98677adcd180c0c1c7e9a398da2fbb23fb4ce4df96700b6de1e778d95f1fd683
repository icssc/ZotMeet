/**
 * The `realtime` client SDK is available through the following.
 *
 * @example
 * ```js title="src/authorizer.ts"
 * import { realtime } from "sst/aws/realtime";
 * ```
 */
export var realtime;
(function (realtime) {
    /**
     * Creates an authorization handler for the `Realtime` component. It validates
     * the token and grants permissions for the topics the client can subscribe and publish to.
     *
     * @example
     * ```js title="src/authorizer.ts" "realtime.authorizer"
     * export const handler = realtime.authorizer(async (token) => {
     *   // Validate the token
     *   console.log(token);
     *
     *   // Return the topics to subscribe and publish
     *   return {
     *     subscribe: ["*"],
     *     publish: ["*"],
     *   };
     * });
     * ```
     */
    function authorizer(input) {
        return async (evt, context) => {
            const [, partition, , region, accountId] = context.invokedFunctionArn.split(":");
            const token = Buffer.from(evt.protocolData.mqtt?.password ?? "", "base64").toString();
            const { principalId = evt.protocolData.mqtt?.username || Date.now().toString(), disconnectAfterInSeconds = 86400, refreshAfterInSeconds = 300, subscribe, publish, policyDocuments, } = await input(token);
            return {
                isAuthenticated: true,
                principalId,
                disconnectAfterInSeconds,
                refreshAfterInSeconds,
                policyDocuments: [
                    {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Action: "iot:Connect",
                                Effect: "Allow",
                                Resource: "*",
                            },
                            ...(subscribe
                                ? [
                                    {
                                        Action: "iot:Receive",
                                        Effect: "Allow",
                                        Resource: subscribe.map((t) => `arn:${partition}:iot:${region}:${accountId}:topic/${t}`),
                                    },
                                ]
                                : []),
                            ...(subscribe
                                ? [
                                    {
                                        Action: "iot:Subscribe",
                                        Effect: "Allow",
                                        Resource: subscribe.map((t) => `arn:${partition}:iot:${region}:${accountId}:topicfilter/${t}`),
                                    },
                                ]
                                : []),
                            ...(publish
                                ? [
                                    {
                                        Action: "iot:Publish",
                                        Effect: "Allow",
                                        Resource: publish.map((t) => `arn:${partition}:iot:${region}:${accountId}:topic/${t}`),
                                    },
                                ]
                                : []),
                        ],
                    },
                    ...(policyDocuments ?? []),
                ],
            };
        };
    }
    realtime.authorizer = authorizer;
})(realtime || (realtime = {}));
