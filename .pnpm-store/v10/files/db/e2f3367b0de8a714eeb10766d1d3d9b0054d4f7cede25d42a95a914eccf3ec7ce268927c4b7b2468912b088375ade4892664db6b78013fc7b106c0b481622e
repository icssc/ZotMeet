export function ZodValidator(schema) {
    return (input) => {
        return schema.parse(input);
    };
}
import { parse } from "valibot";
export function ValibotValidator(schema) {
    return (value) => {
        return parse(schema, value);
    };
}
