import { AwsOptions } from "../aws/client.js";
import { Resource } from "../resource.js";
import { event } from "../event/index.js";
import { EventBridgeEvent, EventBridgeHandler } from "aws-lambda";
export declare namespace bus {
    type Name = Extract<typeof Resource, {
        type: "sst.aws.Bus";
    }>["name"];
    function subscriber<Events extends event.Definition>(_events: Events | Events[], cb: (input: {
        [K in Events["type"]]: Extract<Events, {
            type: K;
        }>["$payload"];
    }[Events["type"]], raw: EventBridgeEvent<string, any>) => Promise<void>): EventBridgeHandler<string, any, void>;
    /** @deprecated
     * use bus.subscriber instead
     * */
    const handler: typeof subscriber;
    function publish<Definition extends event.Definition = any>(name: string | {
        name: string;
    }, def: Definition | string, properties: Definition["$input"], options?: {
        metadata?: Definition["$metadata"];
        aws?: AwsOptions;
    }): Promise<any>;
    class PublishError extends Error {
        readonly response: Response;
        constructor(response: Response);
    }
}
