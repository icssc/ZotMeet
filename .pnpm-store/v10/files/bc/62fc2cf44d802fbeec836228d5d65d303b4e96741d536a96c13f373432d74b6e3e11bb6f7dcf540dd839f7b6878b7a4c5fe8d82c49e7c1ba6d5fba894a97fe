import { z } from "zod";
export function tool(input) {
    return input;
}
tool({
    name: "foo",
    description: "bar",
    args: z.object({
        foo: z.string(),
    }),
    async run(args) { },
});
