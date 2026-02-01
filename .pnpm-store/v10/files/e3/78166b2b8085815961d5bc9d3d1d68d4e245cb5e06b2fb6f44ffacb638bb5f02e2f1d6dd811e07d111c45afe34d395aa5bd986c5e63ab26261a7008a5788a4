import { client } from "./client.js";
/**
 * The `task` client SDK is available through the following.
 *
 * @example
 * ```js title="src/app.ts"
 * import { task } from "sst/aws/task";
 * ```
 *
 * If you are not using Node.js, you can use the AWS SDK instead. For example, you can call
 * [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html) to
 * run a task.
 */
export var task;
(function (task_1) {
    function url(region, options) {
        if (options?.region)
            region = options.region;
        return `https://ecs.${region}.amazonaws.com/`;
    }
    /**
     * Get the details of a given task.
     *
     * :::note
     * If a task had been stopped over an hour ago, it's not returned.
     * :::
     *
     * @example
     *
     * For example, let's say you had previously started a task.
     *
     * ```js title="src/app.ts"
     * const runRet = await task.run(Resource.MyTask);
     * const taskArn = runRet.tasks[0].taskArn;
     * ```
     *
     * You can use that to get the details of the task.
     *
     * ```js title="src/app.ts"
     * const describeRet = await task.describe(Resource.MyTask, taskArn);
     * console.log(describeRet.status);
     * ```
     *
     * If you are not using Node.js, you can use the AWS SDK and call
     * [`DescribeTasks`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTasks.html).
     */
    async function describe(resource, task, options) {
        const c = await client();
        const u = url(c.region, options?.aws);
        const res = await c.fetch(u, {
            method: "POST",
            aws: options?.aws,
            headers: {
                "X-Amz-Target": "AmazonEC2ContainerServiceV20141113.DescribeTasks",
                "Content-Type": "application/x-amz-json-1.1",
            },
            body: JSON.stringify({
                cluster: resource.cluster,
                tasks: [task],
            }),
        });
        if (!res.ok)
            throw new DescribeError(res);
        const data = (await res.json());
        if (!data.tasks?.length)
            throw new DescribeError(res);
        return {
            arn: data.tasks[0].taskArn,
            status: data.tasks[0].lastStatus,
            response: data,
        };
    }
    task_1.describe = describe;
    /**
     * Runs a task.
     *
     * @example
     *
     * For example, let's say you have defined a task.
     *
     * ```js title="sst.config.ts"
     * new sst.aws.Task("MyTask", { cluster });
     * ```
     *
     * You can then run the task in your application with the SDK.
     *
     * ```js title="src/app.ts" {4}
     * import { Resource } from "sst";
     * import { task } from "sst/aws/task";
     *
     * const runRet = await task.run(Resource.MyTask);
     * const taskArn = runRet.tasks[0].taskArn;
     * ```
     *
     * This internally calls an AWS SDK API that returns an array of tasks. But in our case,
     * there's only one task.
     *
     * The `taskArn` is the ARN of the task. You can use it to call the `describe` or `stop`
     * functions.
     *
     * You can also pass in any environment variables to the task.
     *
     * ```js title="src/app.ts"
     * await task.run(Resource.MyTask, {
     *   MY_ENV_VAR: "my-value"
     * });
     * ```
     *
     * If you are not using Node.js, you can use the AWS SDK and call
     * [`RunTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RunTask.html).
     */
    async function run(resource, environment, options) {
        const c = await client();
        const u = url(c.region, options?.aws);
        const res = await c.fetch(u, {
            method: "POST",
            aws: options?.aws,
            headers: {
                "X-Amz-Target": "AmazonEC2ContainerServiceV20141113.RunTask",
                "Content-Type": "application/x-amz-json-1.1",
            },
            body: JSON.stringify({
                capacityProviderStrategy: [
                    {
                        capacityProvider: options?.capacity === "spot" ? "FARGATE_SPOT" : "FARGATE",
                        weight: 1,
                    },
                ],
                cluster: resource.cluster,
                taskDefinition: resource.taskDefinition,
                networkConfiguration: {
                    awsvpcConfiguration: {
                        subnets: resource.subnets,
                        securityGroups: resource.securityGroups,
                        assignPublicIp: resource.assignPublicIp ? "ENABLED" : "DISABLED",
                    },
                },
                overrides: {
                    containerOverrides: resource.containers.map((name) => ({
                        name,
                        environment: Object.entries(environment ?? {}).map(([key, value]) => ({
                            name: key,
                            value,
                        })),
                    })),
                },
            }),
        });
        if (!res.ok)
            throw new RunError(res);
        const data = (await res.json());
        if (!data.tasks?.length)
            throw new RunError(res);
        return {
            arn: data.tasks[0].taskArn,
            status: data.tasks[0].lastStatus,
            response: data,
        };
    }
    task_1.run = run;
    /**
     * Stops a task.
     *
     * @example
     *
     * For example, let's say you had previously started a task.
     *
     * ```js title="src/app.ts"
     * const runRet = await task.run(Resource.MyTask);
     * const taskArn = runRet.tasks[0].taskArn;
     * ```
     *
     * You can stop the task with the following.
     *
     * ```js title="src/app.ts"
     * const stopRet = await task.stop(Resource.MyTask, taskArn);
     * ```
     *
     * Stopping a task is asnychronous. When you call `stop`, AWS marks a task to be stopped,
     * but it may take a few minutes for the task to actually stop.
     *
     * :::note
     * Stopping a task in asyncrhonous.
     * :::
     *
     * In most cases you probably don't need to check if it has been stopped. But if necessary,
     * you can use the `describe` function to get a task's status.
     *
     * If you are not using Node.js, you can use the AWS SDK and call
     * [`StopTask`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_StopTask.html).
     */
    async function stop(resource, task, options) {
        const c = await client();
        const u = url(c.region, options?.aws);
        const res = await c.fetch(u, {
            method: "POST",
            aws: options?.aws,
            headers: {
                "X-Amz-Target": "AmazonEC2ContainerServiceV20141113.StopTask",
                "Content-Type": "application/x-amz-json-1.1",
            },
            body: JSON.stringify({
                cluster: resource.cluster,
                task,
            }),
        });
        if (!res.ok)
            throw new StopError(res);
        const data = (await res.json());
        if (!data.task)
            throw new StopError(res);
        return {
            arn: data.task.taskArn,
            status: data.task.lastStatus,
            response: data,
        };
    }
    task_1.stop = stop;
    class DescribeError extends Error {
        response;
        constructor(response) {
            super("Failed to describe task");
            this.response = response;
            console.log(response);
        }
    }
    task_1.DescribeError = DescribeError;
    class RunError extends Error {
        response;
        constructor(response) {
            super("Failed to run task");
            this.response = response;
            console.log(response);
        }
    }
    task_1.RunError = RunError;
    class StopError extends Error {
        response;
        constructor(response) {
            super("Failed to stop task");
            this.response = response;
            console.log(response);
        }
    }
    task_1.StopError = StopError;
})(task || (task = {}));
