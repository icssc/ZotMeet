const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$1 = require('./dist-cjs-DVzRDdXz.js');

//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/event-streams/EventStreamSerde.js
var import_dist_cjs, EventStreamSerde;
var init_EventStreamSerde = require_chunk.__esmMin((() => {
	import_dist_cjs = require_dist_cjs$1.require_dist_cjs();
	EventStreamSerde = class {
		marshaller;
		serializer;
		deserializer;
		serdeContext;
		defaultContentType;
		constructor({ marshaller, serializer, deserializer, serdeContext, defaultContentType }) {
			this.marshaller = marshaller;
			this.serializer = serializer;
			this.deserializer = deserializer;
			this.serdeContext = serdeContext;
			this.defaultContentType = defaultContentType;
		}
		async serializeEventStream({ eventStream, requestSchema, initialRequest }) {
			const marshaller = this.marshaller;
			const eventStreamMember = requestSchema.getEventStreamMember();
			const unionSchema = requestSchema.getMemberSchema(eventStreamMember);
			const serializer = this.serializer;
			const defaultContentType = this.defaultContentType;
			const initialRequestMarker = Symbol("initialRequestMarker");
			const eventStreamIterable = { async *[Symbol.asyncIterator]() {
				if (initialRequest) {
					const headers = {
						":event-type": {
							type: "string",
							value: "initial-request"
						},
						":message-type": {
							type: "string",
							value: "event"
						},
						":content-type": {
							type: "string",
							value: defaultContentType
						}
					};
					serializer.write(requestSchema, initialRequest);
					const body = serializer.flush();
					yield {
						[initialRequestMarker]: true,
						headers,
						body
					};
				}
				for await (const page of eventStream) yield page;
			} };
			return marshaller.serialize(eventStreamIterable, (event) => {
				if (event[initialRequestMarker]) return {
					headers: event.headers,
					body: event.body
				};
				const unionMember = Object.keys(event).find((key) => {
					return key !== "__type";
				}) ?? "";
				const { additionalHeaders, body, eventType, explicitPayloadContentType } = this.writeEventBody(unionMember, unionSchema, event);
				return {
					headers: {
						":event-type": {
							type: "string",
							value: eventType
						},
						":message-type": {
							type: "string",
							value: "event"
						},
						":content-type": {
							type: "string",
							value: explicitPayloadContentType ?? defaultContentType
						},
						...additionalHeaders
					},
					body
				};
			});
		}
		async deserializeEventStream({ response, responseSchema, initialResponseContainer }) {
			const marshaller = this.marshaller;
			const eventStreamMember = responseSchema.getEventStreamMember();
			const memberSchemas = responseSchema.getMemberSchema(eventStreamMember).getMemberSchemas();
			const initialResponseMarker = Symbol("initialResponseMarker");
			const asyncIterable = marshaller.deserialize(response.body, async (event) => {
				const unionMember = Object.keys(event).find((key) => {
					return key !== "__type";
				}) ?? "";
				const body = event[unionMember].body;
				if (unionMember === "initial-response") {
					const dataObject = await this.deserializer.read(responseSchema, body);
					delete dataObject[eventStreamMember];
					return {
						[initialResponseMarker]: true,
						...dataObject
					};
				} else if (unionMember in memberSchemas) {
					const eventStreamSchema = memberSchemas[unionMember];
					if (eventStreamSchema.isStructSchema()) {
						const out = {};
						let hasBindings = false;
						for (const [name, member] of eventStreamSchema.structIterator()) {
							const { eventHeader, eventPayload } = member.getMergedTraits();
							hasBindings = hasBindings || Boolean(eventHeader || eventPayload);
							if (eventPayload) {
								if (member.isBlobSchema()) out[name] = body;
								else if (member.isStringSchema()) out[name] = (this.serdeContext?.utf8Encoder ?? import_dist_cjs.toUtf8)(body);
								else if (member.isStructSchema()) out[name] = await this.deserializer.read(member, body);
							} else if (eventHeader) {
								const value = event[unionMember].headers[name]?.value;
								if (value != null) if (member.isNumericSchema()) if (value && typeof value === "object" && "bytes" in value) out[name] = BigInt(value.toString());
								else out[name] = Number(value);
								else out[name] = value;
							}
						}
						if (hasBindings) return { [unionMember]: out };
					}
					return { [unionMember]: await this.deserializer.read(eventStreamSchema, body) };
				} else return { $unknown: event };
			});
			const asyncIterator = asyncIterable[Symbol.asyncIterator]();
			const firstEvent = await asyncIterator.next();
			if (firstEvent.done) return asyncIterable;
			if (firstEvent.value?.[initialResponseMarker]) {
				if (!responseSchema) throw new Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
				for (const [key, value] of Object.entries(firstEvent.value)) initialResponseContainer[key] = value;
			}
			return { async *[Symbol.asyncIterator]() {
				if (!firstEvent?.value?.[initialResponseMarker]) yield firstEvent.value;
				while (true) {
					const { done, value } = await asyncIterator.next();
					if (done) break;
					yield value;
				}
			} };
		}
		writeEventBody(unionMember, unionSchema, event) {
			const serializer = this.serializer;
			let eventType = unionMember;
			let explicitPayloadMember = null;
			let explicitPayloadContentType;
			const isKnownSchema = (() => {
				return unionSchema.getSchema()[4].includes(unionMember);
			})();
			const additionalHeaders = {};
			if (!isKnownSchema) {
				const [type, value] = event[unionMember];
				eventType = type;
				serializer.write(15, value);
			} else {
				const eventSchema = unionSchema.getMemberSchema(unionMember);
				if (eventSchema.isStructSchema()) {
					for (const [memberName, memberSchema] of eventSchema.structIterator()) {
						const { eventHeader, eventPayload } = memberSchema.getMergedTraits();
						if (eventPayload) {
							explicitPayloadMember = memberName;
							break;
						} else if (eventHeader) {
							const value = event[unionMember][memberName];
							let type = "binary";
							if (memberSchema.isNumericSchema()) if ((-2) ** 31 <= value && value <= 2 ** 31 - 1) type = "integer";
							else type = "long";
							else if (memberSchema.isTimestampSchema()) type = "timestamp";
							else if (memberSchema.isStringSchema()) type = "string";
							else if (memberSchema.isBooleanSchema()) type = "boolean";
							if (value != null) {
								additionalHeaders[memberName] = {
									type,
									value
								};
								delete event[unionMember][memberName];
							}
						}
					}
					if (explicitPayloadMember !== null) {
						const payloadSchema = eventSchema.getMemberSchema(explicitPayloadMember);
						if (payloadSchema.isBlobSchema()) explicitPayloadContentType = "application/octet-stream";
						else if (payloadSchema.isStringSchema()) explicitPayloadContentType = "text/plain";
						serializer.write(payloadSchema, event[unionMember][explicitPayloadMember]);
					} else serializer.write(eventSchema, event[unionMember]);
				} else throw new Error("@smithy/core/event-streams - non-struct member not supported in event stream union.");
			}
			const messageSerialization = serializer.flush();
			return {
				body: typeof messageSerialization === "string" ? (this.serdeContext?.utf8Decoder ?? import_dist_cjs.fromUtf8)(messageSerialization) : messageSerialization,
				eventType,
				explicitPayloadContentType,
				additionalHeaders
			};
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/event-streams/index.js
var init_event_streams = require_chunk.__esmMin((() => {
	init_EventStreamSerde();
}));

//#endregion
init_event_streams();
exports.EventStreamSerde = EventStreamSerde;