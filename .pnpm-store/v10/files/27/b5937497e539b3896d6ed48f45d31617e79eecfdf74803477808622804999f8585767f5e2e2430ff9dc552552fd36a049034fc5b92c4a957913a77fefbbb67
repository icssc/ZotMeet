import { ZodSchema, z } from "zod";
export declare function ZodValidator<Schema extends ZodSchema>(schema: Schema): (input: z.input<Schema>) => z.output<Schema>;
import { BaseSchema, InferInput } from "valibot";
export declare function ValibotValidator<T extends BaseSchema<any, any, any>>(schema: T): (value: InferInput<T>) => import("valibot").InferOutput<T>;
