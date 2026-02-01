export declare namespace event {
    export type Definition = {
        type: string;
        $input: any;
        $output: any;
        $metadata: any;
        $payload: any;
        create: (...args: any[]) => Promise<any>;
    };
    export function builder<Metadata extends ((type: string, properties: any) => any) | Parameters<Validator>[0], Validator extends (schema: any) => (input: any) => any>(input: {
        validator: Validator;
        metadata?: Metadata;
    }): {
        <Type extends string, Schema extends Parameters<Validator>[0]>(type: Type, schema: Schema): {
            create: Metadata extends (type: string, properties: any) => any ? (properties: inferParser<Schema>["in"]) => Promise<{
                type: Type;
                properties: inferParser<Schema>["out"];
                metadata: Metadata extends (type: string, properties: any) => any ? ReturnType<Metadata> : inferParser<Metadata>["out"];
            }> : (properties: inferParser<Schema>["in"], metadata: inferParser<Metadata>["in"]) => Promise<{
                type: Type;
                properties: inferParser<Schema>["out"];
                metadata: Metadata extends (type: string, properties: any) => any ? ReturnType<Metadata> : inferParser<Metadata>["out"];
            }>;
            type: Type;
            $input: inferParser<Schema>["in"];
            $output: inferParser<Schema>["out"];
            $payload: {
                type: Type;
                properties: inferParser<Schema>["out"];
                metadata: Metadata extends (type: string, properties: any) => any ? ReturnType<Metadata> : inferParser<Metadata>["out"];
            };
            $metadata: Metadata extends (type: string, properties: any) => any ? ReturnType<Metadata> : inferParser<Metadata>["out"];
        };
        coerce<Events extends Definition>(_events: Events | Events[], raw: any): { [K in Events["type"]]: Extract<Events, {
            type: K;
        }>["$payload"]; }[Events["type"]];
    };
    type ParserZodEsque<TInput, TParsedInput> = {
        _input: TInput;
        _output: TParsedInput;
    };
    type ParserValibotEsque<TInput, TParsedInput> = {
        _types?: {
            input: TInput;
            output: TParsedInput;
        };
    };
    type ParserMyZodEsque<TInput> = {
        parse: (input: any) => TInput;
    };
    type ParserSuperstructEsque<TInput> = {
        create: (input: unknown) => TInput;
    };
    type ParserCustomValidatorEsque<TInput> = (input: unknown) => Promise<TInput> | TInput;
    type ParserYupEsque<TInput> = {
        validateSync: (input: unknown) => TInput;
    };
    type ParserScaleEsque<TInput> = {
        assert(value: unknown): asserts value is TInput;
    };
    export type ParserWithoutInput<TInput> = ParserCustomValidatorEsque<TInput> | ParserMyZodEsque<TInput> | ParserScaleEsque<TInput> | ParserSuperstructEsque<TInput> | ParserYupEsque<TInput>;
    export type ParserWithInputOutput<TInput, TParsedInput> = ParserZodEsque<TInput, TParsedInput> | ParserValibotEsque<TInput, TParsedInput>;
    export type Parser = ParserWithInputOutput<any, any> | ParserWithoutInput<any>;
    export type inferParser<TParser extends Parser> = TParser extends ParserWithInputOutput<infer $TIn, infer $TOut> ? {
        in: $TIn;
        out: $TOut;
    } : TParser extends ParserWithoutInput<infer $InOut> ? {
        in: $InOut;
        out: $InOut;
    } : never;
    export {};
}
