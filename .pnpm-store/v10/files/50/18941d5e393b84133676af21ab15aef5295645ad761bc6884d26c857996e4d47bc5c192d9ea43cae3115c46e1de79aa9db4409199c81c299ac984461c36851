export var event;
(function (event) {
    function builder(input) {
        const validator = input.validator;
        const fn = function event(type, schema) {
            const validate = validator(schema);
            async function create(properties, metadata) {
                metadata = input.metadata
                    ? typeof input.metadata === "function"
                        ? input.metadata(type, properties)
                        : input.metadata(metadata)
                    : {};
                properties = validate(properties);
                return {
                    type,
                    properties,
                    metadata,
                };
            }
            return {
                create: create,
                type,
                $input: {},
                $output: {},
                $payload: {},
                $metadata: {},
            };
        };
        fn.coerce = (_events, raw) => {
            return raw;
        };
        return fn;
    }
    event.builder = builder;
})(event || (event = {}));
