import { client } from "../aws/client.js";
import { Resource } from "../resource.js";
export var bus;
(function (bus) {
    function url(region, options) {
        if (options?.region)
            region = options.region;
        return `https://events.${region}.amazonaws.com/`;
    }
    function subscriber(_events, cb) {
        return async function (event) {
            const payload = {
                type: event["detail-type"],
                properties: event.detail.properties,
                metadata: event.detail.metadata,
            };
            return cb(payload, event);
        };
    }
    bus.subscriber = subscriber;
    /** @deprecated
     * use bus.subscriber instead
     * */
    bus.handler = subscriber;
    async function publish(name, def, properties, options) {
        const c = await client();
        const u = url(c.region, options?.aws);
        const evt = typeof def === "string"
            ? {
                type: def,
                properties,
                metadata: options?.metadata || {},
            }
            : await def.create(properties, options?.metadata);
        const res = await c
            .fetch(u, {
            method: "POST",
            aws: options?.aws,
            headers: {
                "X-Amz-Target": "AWSEvents.PutEvents",
                "Content-Type": "application/x-amz-json-1.1",
            },
            body: JSON.stringify({
                Entries: [
                    {
                        Source: [Resource.App.name, Resource.App.stage].join("."),
                        DetailType: evt.type,
                        Detail: JSON.stringify({
                            metadata: evt.metadata,
                            properties: evt.properties,
                        }),
                        EventBusName: typeof name === "string" ? name : name.name,
                    },
                ],
            }),
        })
            .catch((e) => {
            if (e instanceof Error)
                console.log("cause", e.cause);
            throw e;
        });
        if (!res.ok)
            throw new PublishError(res);
        return res.json();
    }
    bus.publish = publish;
    class PublishError extends Error {
        response;
        constructor(response) {
            super("Failed to publish event to bus");
            this.response = response;
        }
    }
    bus.PublishError = PublishError;
})(bus || (bus = {}));
