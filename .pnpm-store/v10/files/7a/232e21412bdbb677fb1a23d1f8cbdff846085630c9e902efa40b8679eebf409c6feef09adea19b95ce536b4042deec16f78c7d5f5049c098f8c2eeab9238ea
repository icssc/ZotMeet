const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$15 = require('./dist-cjs-DcvYtBnm.js');
const require_dist_cjs$16 = require('./dist-cjs-BawS8oYv.js');
const require_dist_cjs$17 = require('./dist-cjs-DVzRDdXz.js');

//#region ../node_modules/.pnpm/@smithy+util-middleware@4.2.5/node_modules/@smithy/util-middleware/dist-cjs/index.js
var require_dist_cjs$10 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var types = require_dist_cjs$15.require_dist_cjs();
	const getSmithyContext = (context) => context[types.SMITHY_CONTEXT_KEY] || (context[types.SMITHY_CONTEXT_KEY] = {});
	const normalizeProvider = (input) => {
		if (typeof input === "function") return input;
		const promisified = Promise.resolve(input);
		return () => promisified;
	};
	exports.getSmithyContext = getSmithyContext;
	exports.normalizeProvider = normalizeProvider;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-base64@4.3.0/node_modules/@smithy/util-base64/dist-cjs/fromBase64.js
var require_fromBase64 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromBase64 = void 0;
	const util_buffer_from_1 = require_dist_cjs$17.require_dist_cjs$1();
	const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
	const fromBase64 = (input) => {
		if (input.length * 3 % 4 !== 0) throw new TypeError(`Incorrect padding on base64 string.`);
		if (!BASE64_REGEX.exec(input)) throw new TypeError(`Invalid base64 string.`);
		const buffer = (0, util_buffer_from_1.fromString)(input, "base64");
		return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	};
	exports.fromBase64 = fromBase64;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-base64@4.3.0/node_modules/@smithy/util-base64/dist-cjs/toBase64.js
var require_toBase64 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toBase64 = void 0;
	const util_buffer_from_1 = require_dist_cjs$17.require_dist_cjs$1();
	const util_utf8_1 = require_dist_cjs$17.require_dist_cjs();
	const toBase64 = (_input) => {
		let input;
		if (typeof _input === "string") input = (0, util_utf8_1.fromUtf8)(_input);
		else input = _input;
		if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
		return (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("base64");
	};
	exports.toBase64 = toBase64;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-base64@4.3.0/node_modules/@smithy/util-base64/dist-cjs/index.js
var require_dist_cjs$9 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var fromBase64 = require_fromBase64();
	var toBase64 = require_toBase64();
	Object.keys(fromBase64).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return fromBase64[k];
			}
		});
	});
	Object.keys(toBase64).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return toBase64[k];
			}
		});
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/checksum/ChecksumStream.js
var require_ChecksumStream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ChecksumStream = void 0;
	const util_base64_1 = require_dist_cjs$9();
	const stream_1$4 = require("stream");
	var ChecksumStream = class extends stream_1$4.Duplex {
		expectedChecksum;
		checksumSourceLocation;
		checksum;
		source;
		base64Encoder;
		constructor({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) {
			super();
			if (typeof source.pipe === "function") this.source = source;
			else throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
			this.base64Encoder = base64Encoder ?? util_base64_1.toBase64;
			this.expectedChecksum = expectedChecksum;
			this.checksum = checksum;
			this.checksumSourceLocation = checksumSourceLocation;
			this.source.pipe(this);
		}
		_read(size) {}
		_write(chunk, encoding, callback) {
			try {
				this.checksum.update(chunk);
				this.push(chunk);
			} catch (e) {
				return callback(e);
			}
			return callback();
		}
		async _final(callback) {
			try {
				const digest = await this.checksum.digest();
				const received = this.base64Encoder(digest);
				if (this.expectedChecksum !== received) return callback(/* @__PURE__ */ new Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${received}" in response header "${this.checksumSourceLocation}".`));
			} catch (e) {
				return callback(e);
			}
			this.push(null);
			return callback();
		}
	};
	exports.ChecksumStream = ChecksumStream;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/stream-type-check.js
var require_stream_type_check = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBlob = exports.isReadableStream = void 0;
	const isReadableStream = (stream$1) => typeof ReadableStream === "function" && (stream$1?.constructor?.name === ReadableStream.name || stream$1 instanceof ReadableStream);
	exports.isReadableStream = isReadableStream;
	const isBlob = (blob) => {
		return typeof Blob === "function" && (blob?.constructor?.name === Blob.name || blob instanceof Blob);
	};
	exports.isBlob = isBlob;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/checksum/ChecksumStream.browser.js
var require_ChecksumStream_browser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ChecksumStream = void 0;
	const ReadableStreamRef = typeof ReadableStream === "function" ? ReadableStream : function() {};
	var ChecksumStream = class extends ReadableStreamRef {};
	exports.ChecksumStream = ChecksumStream;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/checksum/createChecksumStream.browser.js
var require_createChecksumStream_browser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createChecksumStream = void 0;
	const util_base64_1 = require_dist_cjs$9();
	const stream_type_check_1 = require_stream_type_check();
	const ChecksumStream_browser_1 = require_ChecksumStream_browser();
	const createChecksumStream = ({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) => {
		if (!(0, stream_type_check_1.isReadableStream)(source)) throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
		const encoder = base64Encoder ?? util_base64_1.toBase64;
		if (typeof TransformStream !== "function") throw new Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
		const transform = new TransformStream({
			start() {},
			async transform(chunk, controller) {
				checksum.update(chunk);
				controller.enqueue(chunk);
			},
			async flush(controller) {
				const received = encoder(await checksum.digest());
				if (expectedChecksum !== received) {
					const error$1 = /* @__PURE__ */ new Error(`Checksum mismatch: expected "${expectedChecksum}" but received "${received}" in response header "${checksumSourceLocation}".`);
					controller.error(error$1);
				} else controller.terminate();
			}
		});
		source.pipeThrough(transform);
		const readable = transform.readable;
		Object.setPrototypeOf(readable, ChecksumStream_browser_1.ChecksumStream.prototype);
		return readable;
	};
	exports.createChecksumStream = createChecksumStream;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/checksum/createChecksumStream.js
var require_createChecksumStream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createChecksumStream = createChecksumStream;
	const stream_type_check_1 = require_stream_type_check();
	const ChecksumStream_1 = require_ChecksumStream();
	const createChecksumStream_browser_1 = require_createChecksumStream_browser();
	function createChecksumStream(init) {
		if (typeof ReadableStream === "function" && (0, stream_type_check_1.isReadableStream)(init.source)) return (0, createChecksumStream_browser_1.createChecksumStream)(init);
		return new ChecksumStream_1.ChecksumStream(init);
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/ByteArrayCollector.js
var require_ByteArrayCollector = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ByteArrayCollector = void 0;
	var ByteArrayCollector = class {
		allocByteArray;
		byteLength = 0;
		byteArrays = [];
		constructor(allocByteArray) {
			this.allocByteArray = allocByteArray;
		}
		push(byteArray) {
			this.byteArrays.push(byteArray);
			this.byteLength += byteArray.byteLength;
		}
		flush() {
			if (this.byteArrays.length === 1) {
				const bytes = this.byteArrays[0];
				this.reset();
				return bytes;
			}
			const aggregation = this.allocByteArray(this.byteLength);
			let cursor = 0;
			for (let i = 0; i < this.byteArrays.length; ++i) {
				const bytes = this.byteArrays[i];
				aggregation.set(bytes, cursor);
				cursor += bytes.byteLength;
			}
			this.reset();
			return aggregation;
		}
		reset() {
			this.byteArrays = [];
			this.byteLength = 0;
		}
	};
	exports.ByteArrayCollector = ByteArrayCollector;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/createBufferedReadableStream.js
var require_createBufferedReadableStream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createBufferedReadable = void 0;
	exports.createBufferedReadableStream = createBufferedReadableStream;
	exports.merge = merge;
	exports.flush = flush;
	exports.sizeOf = sizeOf;
	exports.modeOf = modeOf;
	const ByteArrayCollector_1 = require_ByteArrayCollector();
	function createBufferedReadableStream(upstream, size, logger$1) {
		const reader = upstream.getReader();
		let streamBufferingLoggedWarning = false;
		let bytesSeen = 0;
		const buffers = ["", new ByteArrayCollector_1.ByteArrayCollector((size$1) => new Uint8Array(size$1))];
		let mode = -1;
		const pull = async (controller) => {
			const { value, done } = await reader.read();
			const chunk = value;
			if (done) {
				if (mode !== -1) {
					const remainder = flush(buffers, mode);
					if (sizeOf(remainder) > 0) controller.enqueue(remainder);
				}
				controller.close();
			} else {
				const chunkMode = modeOf(chunk, false);
				if (mode !== chunkMode) {
					if (mode >= 0) controller.enqueue(flush(buffers, mode));
					mode = chunkMode;
				}
				if (mode === -1) {
					controller.enqueue(chunk);
					return;
				}
				const chunkSize = sizeOf(chunk);
				bytesSeen += chunkSize;
				const bufferSize = sizeOf(buffers[mode]);
				if (chunkSize >= size && bufferSize === 0) controller.enqueue(chunk);
				else {
					const newSize = merge(buffers, mode, chunk);
					if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
						streamBufferingLoggedWarning = true;
						logger$1?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
					}
					if (newSize >= size) controller.enqueue(flush(buffers, mode));
					else await pull(controller);
				}
			}
		};
		return new ReadableStream({ pull });
	}
	exports.createBufferedReadable = createBufferedReadableStream;
	function merge(buffers, mode, chunk) {
		switch (mode) {
			case 0:
				buffers[0] += chunk;
				return sizeOf(buffers[0]);
			case 1:
			case 2:
				buffers[mode].push(chunk);
				return sizeOf(buffers[mode]);
		}
	}
	function flush(buffers, mode) {
		switch (mode) {
			case 0:
				const s = buffers[0];
				buffers[0] = "";
				return s;
			case 1:
			case 2: return buffers[mode].flush();
		}
		throw new Error(`@smithy/util-stream - invalid index ${mode} given to flush()`);
	}
	function sizeOf(chunk) {
		return chunk?.byteLength ?? chunk?.length ?? 0;
	}
	function modeOf(chunk, allowBuffer = true) {
		if (allowBuffer && typeof Buffer !== "undefined" && chunk instanceof Buffer) return 2;
		if (chunk instanceof Uint8Array) return 1;
		if (typeof chunk === "string") return 0;
		return -1;
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/createBufferedReadable.js
var require_createBufferedReadable = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createBufferedReadable = createBufferedReadable;
	const node_stream_1 = require("node:stream");
	const ByteArrayCollector_1 = require_ByteArrayCollector();
	const createBufferedReadableStream_1 = require_createBufferedReadableStream();
	const stream_type_check_1 = require_stream_type_check();
	function createBufferedReadable(upstream, size, logger$1) {
		if ((0, stream_type_check_1.isReadableStream)(upstream)) return (0, createBufferedReadableStream_1.createBufferedReadableStream)(upstream, size, logger$1);
		const downstream = new node_stream_1.Readable({ read() {} });
		let streamBufferingLoggedWarning = false;
		let bytesSeen = 0;
		const buffers = [
			"",
			new ByteArrayCollector_1.ByteArrayCollector((size$1) => new Uint8Array(size$1)),
			new ByteArrayCollector_1.ByteArrayCollector((size$1) => Buffer.from(new Uint8Array(size$1)))
		];
		let mode = -1;
		upstream.on("data", (chunk) => {
			const chunkMode = (0, createBufferedReadableStream_1.modeOf)(chunk, true);
			if (mode !== chunkMode) {
				if (mode >= 0) downstream.push((0, createBufferedReadableStream_1.flush)(buffers, mode));
				mode = chunkMode;
			}
			if (mode === -1) {
				downstream.push(chunk);
				return;
			}
			const chunkSize = (0, createBufferedReadableStream_1.sizeOf)(chunk);
			bytesSeen += chunkSize;
			const bufferSize = (0, createBufferedReadableStream_1.sizeOf)(buffers[mode]);
			if (chunkSize >= size && bufferSize === 0) downstream.push(chunk);
			else {
				const newSize = (0, createBufferedReadableStream_1.merge)(buffers, mode, chunk);
				if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
					streamBufferingLoggedWarning = true;
					logger$1?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
				}
				if (newSize >= size) downstream.push((0, createBufferedReadableStream_1.flush)(buffers, mode));
			}
		});
		upstream.on("end", () => {
			if (mode !== -1) {
				const remainder = (0, createBufferedReadableStream_1.flush)(buffers, mode);
				if ((0, createBufferedReadableStream_1.sizeOf)(remainder) > 0) downstream.push(remainder);
			}
			downstream.push(null);
		});
		return downstream;
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/getAwsChunkedEncodingStream.js
var require_getAwsChunkedEncodingStream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAwsChunkedEncodingStream = void 0;
	const stream_1$3 = require("stream");
	const getAwsChunkedEncodingStream = (readableStream, options) => {
		const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
		const checksumRequired = base64Encoder !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
		const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0;
		const awsChunkedEncodingStream = new stream_1$3.Readable({ read: () => {} });
		readableStream.on("data", (data) => {
			const length = bodyLengthChecker(data) || 0;
			awsChunkedEncodingStream.push(`${length.toString(16)}\r\n`);
			awsChunkedEncodingStream.push(data);
			awsChunkedEncodingStream.push("\r\n");
		});
		readableStream.on("end", async () => {
			awsChunkedEncodingStream.push(`0\r\n`);
			if (checksumRequired) {
				const checksum = base64Encoder(await digest);
				awsChunkedEncodingStream.push(`${checksumLocationName}:${checksum}\r\n`);
				awsChunkedEncodingStream.push(`\r\n`);
			}
			awsChunkedEncodingStream.push(null);
		});
		return awsChunkedEncodingStream;
	};
	exports.getAwsChunkedEncodingStream = getAwsChunkedEncodingStream;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/headStream.browser.js
var require_headStream_browser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.headStream = headStream;
	async function headStream(stream$1, bytes) {
		let byteLengthCounter = 0;
		const chunks = [];
		const reader = stream$1.getReader();
		let isDone = false;
		while (!isDone) {
			const { done, value } = await reader.read();
			if (value) {
				chunks.push(value);
				byteLengthCounter += value?.byteLength ?? 0;
			}
			if (byteLengthCounter >= bytes) break;
			isDone = done;
		}
		reader.releaseLock();
		const collected = new Uint8Array(Math.min(bytes, byteLengthCounter));
		let offset = 0;
		for (const chunk of chunks) {
			if (chunk.byteLength > collected.byteLength - offset) {
				collected.set(chunk.subarray(0, collected.byteLength - offset), offset);
				break;
			} else collected.set(chunk, offset);
			offset += chunk.length;
		}
		return collected;
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/headStream.js
var require_headStream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.headStream = void 0;
	const stream_1$2 = require("stream");
	const headStream_browser_1 = require_headStream_browser();
	const stream_type_check_1 = require_stream_type_check();
	const headStream = (stream$1, bytes) => {
		if ((0, stream_type_check_1.isReadableStream)(stream$1)) return (0, headStream_browser_1.headStream)(stream$1, bytes);
		return new Promise((resolve, reject) => {
			const collector = new Collector();
			collector.limit = bytes;
			stream$1.pipe(collector);
			stream$1.on("error", (err) => {
				collector.end();
				reject(err);
			});
			collector.on("error", reject);
			collector.on("finish", function() {
				resolve(new Uint8Array(Buffer.concat(this.buffers)));
			});
		});
	};
	exports.headStream = headStream;
	var Collector = class extends stream_1$2.Writable {
		buffers = [];
		limit = Infinity;
		bytesBuffered = 0;
		_write(chunk, encoding, callback) {
			this.buffers.push(chunk);
			this.bytesBuffered += chunk.byteLength ?? 0;
			if (this.bytesBuffered >= this.limit) {
				const excess = this.bytesBuffered - this.limit;
				const tailBuffer = this.buffers[this.buffers.length - 1];
				this.buffers[this.buffers.length - 1] = tailBuffer.subarray(0, tailBuffer.byteLength - excess);
				this.emit("finish");
			}
			callback();
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-uri-escape@4.2.0/node_modules/@smithy/util-uri-escape/dist-cjs/index.js
var require_dist_cjs$8 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
	const hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
	const escapeUriPath = (uri) => uri.split("/").map(escapeUri).join("/");
	exports.escapeUri = escapeUri;
	exports.escapeUriPath = escapeUriPath;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+querystring-builder@4.2.5/node_modules/@smithy/querystring-builder/dist-cjs/index.js
var require_dist_cjs$7 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilUriEscape = require_dist_cjs$8();
	function buildQueryString(query) {
		const parts = [];
		for (let key of Object.keys(query).sort()) {
			const value = query[key];
			key = utilUriEscape.escapeUri(key);
			if (Array.isArray(value)) for (let i = 0, iLen = value.length; i < iLen; i++) parts.push(`${key}=${utilUriEscape.escapeUri(value[i])}`);
			else {
				let qsEntry = key;
				if (value || typeof value === "string") qsEntry += `=${utilUriEscape.escapeUri(value)}`;
				parts.push(qsEntry);
			}
		}
		return parts.join("&");
	}
	exports.buildQueryString = buildQueryString;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+node-http-handler@4.4.5/node_modules/@smithy/node-http-handler/dist-cjs/index.js
var require_dist_cjs$6 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var protocolHttp = require_dist_cjs$16.require_dist_cjs();
	var querystringBuilder = require_dist_cjs$7();
	var http = require("http");
	var https = require("https");
	var stream = require("stream");
	var http2 = require("http2");
	const NODEJS_TIMEOUT_ERROR_CODES = [
		"ECONNRESET",
		"EPIPE",
		"ETIMEDOUT"
	];
	const getTransformedHeaders = (headers) => {
		const transformedHeaders = {};
		for (const name of Object.keys(headers)) {
			const headerValues = headers[name];
			transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
		}
		return transformedHeaders;
	};
	const timing = {
		setTimeout: (cb, ms) => setTimeout(cb, ms),
		clearTimeout: (timeoutId) => clearTimeout(timeoutId)
	};
	const DEFER_EVENT_LISTENER_TIME$2 = 1e3;
	const setConnectionTimeout = (request, reject, timeoutInMs = 0) => {
		if (!timeoutInMs) return -1;
		const registerTimeout = (offset) => {
			const timeoutId = timing.setTimeout(() => {
				request.destroy();
				reject(Object.assign(/* @__PURE__ */ new Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${timeoutInMs} ms.`), { name: "TimeoutError" }));
			}, timeoutInMs - offset);
			const doWithSocket = (socket) => {
				if (socket?.connecting) socket.on("connect", () => {
					timing.clearTimeout(timeoutId);
				});
				else timing.clearTimeout(timeoutId);
			};
			if (request.socket) doWithSocket(request.socket);
			else request.on("socket", doWithSocket);
		};
		if (timeoutInMs < 2e3) {
			registerTimeout(0);
			return 0;
		}
		return timing.setTimeout(registerTimeout.bind(null, DEFER_EVENT_LISTENER_TIME$2), DEFER_EVENT_LISTENER_TIME$2);
	};
	const setRequestTimeout = (req, reject, timeoutInMs = 0, throwOnRequestTimeout, logger$1) => {
		if (timeoutInMs) return timing.setTimeout(() => {
			let msg = `@smithy/node-http-handler - [${throwOnRequestTimeout ? "ERROR" : "WARN"}] a request has exceeded the configured ${timeoutInMs} ms requestTimeout.`;
			if (throwOnRequestTimeout) {
				const error$1 = Object.assign(new Error(msg), {
					name: "TimeoutError",
					code: "ETIMEDOUT"
				});
				req.destroy(error$1);
				reject(error$1);
			} else {
				msg += ` Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.`;
				logger$1?.warn?.(msg);
			}
		}, timeoutInMs);
		return -1;
	};
	const DEFER_EVENT_LISTENER_TIME$1 = 3e3;
	const setSocketKeepAlive = (request, { keepAlive, keepAliveMsecs }, deferTimeMs = DEFER_EVENT_LISTENER_TIME$1) => {
		if (keepAlive !== true) return -1;
		const registerListener = () => {
			if (request.socket) request.socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
			else request.on("socket", (socket) => {
				socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
			});
		};
		if (deferTimeMs === 0) {
			registerListener();
			return 0;
		}
		return timing.setTimeout(registerListener, deferTimeMs);
	};
	const DEFER_EVENT_LISTENER_TIME = 3e3;
	const setSocketTimeout = (request, reject, timeoutInMs = 0) => {
		const registerTimeout = (offset) => {
			const timeout = timeoutInMs - offset;
			const onTimeout = () => {
				request.destroy();
				reject(Object.assign(/* @__PURE__ */ new Error(`@smithy/node-http-handler - the request socket timed out after ${timeoutInMs} ms of inactivity (configured by client requestHandler).`), { name: "TimeoutError" }));
			};
			if (request.socket) {
				request.socket.setTimeout(timeout, onTimeout);
				request.on("close", () => request.socket?.removeListener("timeout", onTimeout));
			} else request.setTimeout(timeout, onTimeout);
		};
		if (0 < timeoutInMs && timeoutInMs < 6e3) {
			registerTimeout(0);
			return 0;
		}
		return timing.setTimeout(registerTimeout.bind(null, timeoutInMs === 0 ? 0 : DEFER_EVENT_LISTENER_TIME), DEFER_EVENT_LISTENER_TIME);
	};
	const MIN_WAIT_TIME = 6e3;
	async function writeRequestBody(httpRequest, request, maxContinueTimeoutMs = MIN_WAIT_TIME, externalAgent = false) {
		const headers = request.headers ?? {};
		const expect = headers.Expect || headers.expect;
		let timeoutId = -1;
		let sendBody = true;
		if (!externalAgent && expect === "100-continue") sendBody = await Promise.race([new Promise((resolve) => {
			timeoutId = Number(timing.setTimeout(() => resolve(true), Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
		}), new Promise((resolve) => {
			httpRequest.on("continue", () => {
				timing.clearTimeout(timeoutId);
				resolve(true);
			});
			httpRequest.on("response", () => {
				timing.clearTimeout(timeoutId);
				resolve(false);
			});
			httpRequest.on("error", () => {
				timing.clearTimeout(timeoutId);
				resolve(false);
			});
		})]);
		if (sendBody) writeBody(httpRequest, request.body);
	}
	function writeBody(httpRequest, body) {
		if (body instanceof stream.Readable) {
			body.pipe(httpRequest);
			return;
		}
		if (body) {
			if (Buffer.isBuffer(body) || typeof body === "string") {
				httpRequest.end(body);
				return;
			}
			const uint8 = body;
			if (typeof uint8 === "object" && uint8.buffer && typeof uint8.byteOffset === "number" && typeof uint8.byteLength === "number") {
				httpRequest.end(Buffer.from(uint8.buffer, uint8.byteOffset, uint8.byteLength));
				return;
			}
			httpRequest.end(Buffer.from(body));
			return;
		}
		httpRequest.end();
	}
	const DEFAULT_REQUEST_TIMEOUT = 0;
	var NodeHttpHandler = class NodeHttpHandler {
		config;
		configProvider;
		socketWarningTimestamp = 0;
		externalAgent = false;
		metadata = { handlerProtocol: "http/1.1" };
		static create(instanceOrOptions) {
			if (typeof instanceOrOptions?.handle === "function") return instanceOrOptions;
			return new NodeHttpHandler(instanceOrOptions);
		}
		static checkSocketUsage(agent, socketWarningTimestamp, logger$1 = console) {
			const { sockets, requests, maxSockets } = agent;
			if (typeof maxSockets !== "number" || maxSockets === Infinity) return socketWarningTimestamp;
			if (Date.now() - 15e3 < socketWarningTimestamp) return socketWarningTimestamp;
			if (sockets && requests) for (const origin in sockets) {
				const socketsInUse = sockets[origin]?.length ?? 0;
				const requestsEnqueued = requests[origin]?.length ?? 0;
				if (socketsInUse >= maxSockets && requestsEnqueued >= 2 * maxSockets) {
					logger$1?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${socketsInUse} and ${requestsEnqueued} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`);
					return Date.now();
				}
			}
			return socketWarningTimestamp;
		}
		constructor(options) {
			this.configProvider = new Promise((resolve, reject) => {
				if (typeof options === "function") options().then((_options) => {
					resolve(this.resolveDefaultConfig(_options));
				}).catch(reject);
				else resolve(this.resolveDefaultConfig(options));
			});
		}
		resolveDefaultConfig(options) {
			const { requestTimeout, connectionTimeout, socketTimeout, socketAcquisitionWarningTimeout, httpAgent, httpsAgent, throwOnRequestTimeout } = options || {};
			const keepAlive = true;
			const maxSockets = 50;
			return {
				connectionTimeout,
				requestTimeout,
				socketTimeout,
				socketAcquisitionWarningTimeout,
				throwOnRequestTimeout,
				httpAgent: (() => {
					if (httpAgent instanceof http.Agent || typeof httpAgent?.destroy === "function") {
						this.externalAgent = true;
						return httpAgent;
					}
					return new http.Agent({
						keepAlive,
						maxSockets,
						...httpAgent
					});
				})(),
				httpsAgent: (() => {
					if (httpsAgent instanceof https.Agent || typeof httpsAgent?.destroy === "function") {
						this.externalAgent = true;
						return httpsAgent;
					}
					return new https.Agent({
						keepAlive,
						maxSockets,
						...httpsAgent
					});
				})(),
				logger: console
			};
		}
		destroy() {
			this.config?.httpAgent?.destroy();
			this.config?.httpsAgent?.destroy();
		}
		async handle(request, { abortSignal, requestTimeout } = {}) {
			if (!this.config) this.config = await this.configProvider;
			return new Promise((_resolve, _reject) => {
				const config = this.config;
				let writeRequestBodyPromise = void 0;
				const timeouts = [];
				const resolve = async (arg) => {
					await writeRequestBodyPromise;
					timeouts.forEach(timing.clearTimeout);
					_resolve(arg);
				};
				const reject = async (arg) => {
					await writeRequestBodyPromise;
					timeouts.forEach(timing.clearTimeout);
					_reject(arg);
				};
				if (abortSignal?.aborted) {
					const abortError = /* @__PURE__ */ new Error("Request aborted");
					abortError.name = "AbortError";
					reject(abortError);
					return;
				}
				const isSSL = request.protocol === "https:";
				const headers = request.headers ?? {};
				const expectContinue = (headers.Expect ?? headers.expect) === "100-continue";
				let agent = isSSL ? config.httpsAgent : config.httpAgent;
				if (expectContinue && !this.externalAgent) agent = new (isSSL ? https.Agent : http.Agent)({
					keepAlive: false,
					maxSockets: Infinity
				});
				timeouts.push(timing.setTimeout(() => {
					this.socketWarningTimestamp = NodeHttpHandler.checkSocketUsage(agent, this.socketWarningTimestamp, config.logger);
				}, config.socketAcquisitionWarningTimeout ?? (config.requestTimeout ?? 2e3) + (config.connectionTimeout ?? 1e3)));
				const queryString = querystringBuilder.buildQueryString(request.query || {});
				let auth = void 0;
				if (request.username != null || request.password != null) auth = `${request.username ?? ""}:${request.password ?? ""}`;
				let path = request.path;
				if (queryString) path += `?${queryString}`;
				if (request.fragment) path += `#${request.fragment}`;
				let hostname = request.hostname ?? "";
				if (hostname[0] === "[" && hostname.endsWith("]")) hostname = request.hostname.slice(1, -1);
				else hostname = request.hostname;
				const nodeHttpsOptions = {
					headers: request.headers,
					host: hostname,
					method: request.method,
					path,
					port: request.port,
					agent,
					auth
				};
				const req = (isSSL ? https.request : http.request)(nodeHttpsOptions, (res) => {
					resolve({ response: new protocolHttp.HttpResponse({
						statusCode: res.statusCode || -1,
						reason: res.statusMessage,
						headers: getTransformedHeaders(res.headers),
						body: res
					}) });
				});
				req.on("error", (err) => {
					if (NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) reject(Object.assign(err, { name: "TimeoutError" }));
					else reject(err);
				});
				if (abortSignal) {
					const onAbort = () => {
						req.destroy();
						const abortError = /* @__PURE__ */ new Error("Request aborted");
						abortError.name = "AbortError";
						reject(abortError);
					};
					if (typeof abortSignal.addEventListener === "function") {
						const signal = abortSignal;
						signal.addEventListener("abort", onAbort, { once: true });
						req.once("close", () => signal.removeEventListener("abort", onAbort));
					} else abortSignal.onabort = onAbort;
				}
				const effectiveRequestTimeout = requestTimeout ?? config.requestTimeout;
				timeouts.push(setConnectionTimeout(req, reject, config.connectionTimeout));
				timeouts.push(setRequestTimeout(req, reject, effectiveRequestTimeout, config.throwOnRequestTimeout, config.logger ?? console));
				timeouts.push(setSocketTimeout(req, reject, config.socketTimeout));
				const httpAgent = nodeHttpsOptions.agent;
				if (typeof httpAgent === "object" && "keepAlive" in httpAgent) timeouts.push(setSocketKeepAlive(req, {
					keepAlive: httpAgent.keepAlive,
					keepAliveMsecs: httpAgent.keepAliveMsecs
				}));
				writeRequestBodyPromise = writeRequestBody(req, request, effectiveRequestTimeout, this.externalAgent).catch((e) => {
					timeouts.forEach(timing.clearTimeout);
					return _reject(e);
				});
			});
		}
		updateHttpClientConfig(key, value) {
			this.config = void 0;
			this.configProvider = this.configProvider.then((config) => {
				return {
					...config,
					[key]: value
				};
			});
		}
		httpHandlerConfigs() {
			return this.config ?? {};
		}
	};
	var NodeHttp2ConnectionPool = class {
		sessions = [];
		constructor(sessions) {
			this.sessions = sessions ?? [];
		}
		poll() {
			if (this.sessions.length > 0) return this.sessions.shift();
		}
		offerLast(session) {
			this.sessions.push(session);
		}
		contains(session) {
			return this.sessions.includes(session);
		}
		remove(session) {
			this.sessions = this.sessions.filter((s) => s !== session);
		}
		[Symbol.iterator]() {
			return this.sessions[Symbol.iterator]();
		}
		destroy(connection) {
			for (const session of this.sessions) if (session === connection) {
				if (!session.destroyed) session.destroy();
			}
		}
	};
	var NodeHttp2ConnectionManager = class {
		constructor(config) {
			this.config = config;
			if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw new RangeError("maxConcurrency must be greater than zero.");
		}
		config;
		sessionCache = /* @__PURE__ */ new Map();
		lease(requestContext, connectionConfiguration) {
			const url = this.getUrlString(requestContext);
			const existingPool = this.sessionCache.get(url);
			if (existingPool) {
				const existingSession = existingPool.poll();
				if (existingSession && !this.config.disableConcurrency) return existingSession;
			}
			const session = http2.connect(url);
			if (this.config.maxConcurrency) session.settings({ maxConcurrentStreams: this.config.maxConcurrency }, (err) => {
				if (err) throw new Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + requestContext.destination.toString());
			});
			session.unref();
			const destroySessionCb = () => {
				session.destroy();
				this.deleteSession(url, session);
			};
			session.on("goaway", destroySessionCb);
			session.on("error", destroySessionCb);
			session.on("frameError", destroySessionCb);
			session.on("close", () => this.deleteSession(url, session));
			if (connectionConfiguration.requestTimeout) session.setTimeout(connectionConfiguration.requestTimeout, destroySessionCb);
			const connectionPool = this.sessionCache.get(url) || new NodeHttp2ConnectionPool();
			connectionPool.offerLast(session);
			this.sessionCache.set(url, connectionPool);
			return session;
		}
		deleteSession(authority, session) {
			const existingConnectionPool = this.sessionCache.get(authority);
			if (!existingConnectionPool) return;
			if (!existingConnectionPool.contains(session)) return;
			existingConnectionPool.remove(session);
			this.sessionCache.set(authority, existingConnectionPool);
		}
		release(requestContext, session) {
			const cacheKey = this.getUrlString(requestContext);
			this.sessionCache.get(cacheKey)?.offerLast(session);
		}
		destroy() {
			for (const [key, connectionPool] of this.sessionCache) {
				for (const session of connectionPool) {
					if (!session.destroyed) session.destroy();
					connectionPool.remove(session);
				}
				this.sessionCache.delete(key);
			}
		}
		setMaxConcurrentStreams(maxConcurrentStreams) {
			if (maxConcurrentStreams && maxConcurrentStreams <= 0) throw new RangeError("maxConcurrentStreams must be greater than zero.");
			this.config.maxConcurrency = maxConcurrentStreams;
		}
		setDisableConcurrentStreams(disableConcurrentStreams) {
			this.config.disableConcurrency = disableConcurrentStreams;
		}
		getUrlString(request) {
			return request.destination.toString();
		}
	};
	var NodeHttp2Handler = class NodeHttp2Handler {
		config;
		configProvider;
		metadata = { handlerProtocol: "h2" };
		connectionManager = new NodeHttp2ConnectionManager({});
		static create(instanceOrOptions) {
			if (typeof instanceOrOptions?.handle === "function") return instanceOrOptions;
			return new NodeHttp2Handler(instanceOrOptions);
		}
		constructor(options) {
			this.configProvider = new Promise((resolve, reject) => {
				if (typeof options === "function") options().then((opts) => {
					resolve(opts || {});
				}).catch(reject);
				else resolve(options || {});
			});
		}
		destroy() {
			this.connectionManager.destroy();
		}
		async handle(request, { abortSignal, requestTimeout } = {}) {
			if (!this.config) {
				this.config = await this.configProvider;
				this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || false);
				if (this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams);
			}
			const { requestTimeout: configRequestTimeout, disableConcurrentStreams } = this.config;
			const effectiveRequestTimeout = requestTimeout ?? configRequestTimeout;
			return new Promise((_resolve, _reject) => {
				let fulfilled = false;
				let writeRequestBodyPromise = void 0;
				const resolve = async (arg) => {
					await writeRequestBodyPromise;
					_resolve(arg);
				};
				const reject = async (arg) => {
					await writeRequestBodyPromise;
					_reject(arg);
				};
				if (abortSignal?.aborted) {
					fulfilled = true;
					const abortError = /* @__PURE__ */ new Error("Request aborted");
					abortError.name = "AbortError";
					reject(abortError);
					return;
				}
				const { hostname, method, port, protocol, query } = request;
				let auth = "";
				if (request.username != null || request.password != null) auth = `${request.username ?? ""}:${request.password ?? ""}@`;
				const authority = `${protocol}//${auth}${hostname}${port ? `:${port}` : ""}`;
				const requestContext = { destination: new URL(authority) };
				const session = this.connectionManager.lease(requestContext, {
					requestTimeout: this.config?.sessionTimeout,
					disableConcurrentStreams: disableConcurrentStreams || false
				});
				const rejectWithDestroy = (err) => {
					if (disableConcurrentStreams) this.destroySession(session);
					fulfilled = true;
					reject(err);
				};
				const queryString = querystringBuilder.buildQueryString(query || {});
				let path = request.path;
				if (queryString) path += `?${queryString}`;
				if (request.fragment) path += `#${request.fragment}`;
				const req = session.request({
					...request.headers,
					[http2.constants.HTTP2_HEADER_PATH]: path,
					[http2.constants.HTTP2_HEADER_METHOD]: method
				});
				session.ref();
				req.on("response", (headers) => {
					const httpResponse = new protocolHttp.HttpResponse({
						statusCode: headers[":status"] || -1,
						headers: getTransformedHeaders(headers),
						body: req
					});
					fulfilled = true;
					resolve({ response: httpResponse });
					if (disableConcurrentStreams) {
						session.close();
						this.connectionManager.deleteSession(authority, session);
					}
				});
				if (effectiveRequestTimeout) req.setTimeout(effectiveRequestTimeout, () => {
					req.close();
					const timeoutError = /* @__PURE__ */ new Error(`Stream timed out because of no activity for ${effectiveRequestTimeout} ms`);
					timeoutError.name = "TimeoutError";
					rejectWithDestroy(timeoutError);
				});
				if (abortSignal) {
					const onAbort = () => {
						req.close();
						const abortError = /* @__PURE__ */ new Error("Request aborted");
						abortError.name = "AbortError";
						rejectWithDestroy(abortError);
					};
					if (typeof abortSignal.addEventListener === "function") {
						const signal = abortSignal;
						signal.addEventListener("abort", onAbort, { once: true });
						req.once("close", () => signal.removeEventListener("abort", onAbort));
					} else abortSignal.onabort = onAbort;
				}
				req.on("frameError", (type, code, id) => {
					rejectWithDestroy(/* @__PURE__ */ new Error(`Frame type id ${type} in stream id ${id} has failed with code ${code}.`));
				});
				req.on("error", rejectWithDestroy);
				req.on("aborted", () => {
					rejectWithDestroy(/* @__PURE__ */ new Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${req.rstCode}.`));
				});
				req.on("close", () => {
					session.unref();
					if (disableConcurrentStreams) session.destroy();
					if (!fulfilled) rejectWithDestroy(/* @__PURE__ */ new Error("Unexpected error: http2 request did not get a response"));
				});
				writeRequestBodyPromise = writeRequestBody(req, request, effectiveRequestTimeout);
			});
		}
		updateHttpClientConfig(key, value) {
			this.config = void 0;
			this.configProvider = this.configProvider.then((config) => {
				return {
					...config,
					[key]: value
				};
			});
		}
		httpHandlerConfigs() {
			return this.config ?? {};
		}
		destroySession(session) {
			if (!session.destroyed) session.destroy();
		}
	};
	var Collector = class extends stream.Writable {
		bufferedBytes = [];
		_write(chunk, encoding, callback) {
			this.bufferedBytes.push(chunk);
			callback();
		}
	};
	const streamCollector = (stream$1) => {
		if (isReadableStreamInstance(stream$1)) return collectReadableStream(stream$1);
		return new Promise((resolve, reject) => {
			const collector = new Collector();
			stream$1.pipe(collector);
			stream$1.on("error", (err) => {
				collector.end();
				reject(err);
			});
			collector.on("error", reject);
			collector.on("finish", function() {
				resolve(new Uint8Array(Buffer.concat(this.bufferedBytes)));
			});
		});
	};
	const isReadableStreamInstance = (stream$1) => typeof ReadableStream === "function" && stream$1 instanceof ReadableStream;
	async function collectReadableStream(stream$1) {
		const chunks = [];
		const reader = stream$1.getReader();
		let isDone = false;
		let length = 0;
		while (!isDone) {
			const { done, value } = await reader.read();
			if (value) {
				chunks.push(value);
				length += value.length;
			}
			isDone = done;
		}
		const collected = new Uint8Array(length);
		let offset = 0;
		for (const chunk of chunks) {
			collected.set(chunk, offset);
			offset += chunk.length;
		}
		return collected;
	}
	exports.DEFAULT_REQUEST_TIMEOUT = DEFAULT_REQUEST_TIMEOUT;
	exports.NodeHttp2Handler = NodeHttp2Handler;
	exports.NodeHttpHandler = NodeHttpHandler;
	exports.streamCollector = streamCollector;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+fetch-http-handler@5.3.6/node_modules/@smithy/fetch-http-handler/dist-cjs/index.js
var require_dist_cjs$5 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var protocolHttp = require_dist_cjs$16.require_dist_cjs();
	var querystringBuilder = require_dist_cjs$7();
	var utilBase64 = require_dist_cjs$9();
	function createRequest(url, requestOptions) {
		return new Request(url, requestOptions);
	}
	function requestTimeout(timeoutInMs = 0) {
		return new Promise((resolve, reject) => {
			if (timeoutInMs) setTimeout(() => {
				const timeoutError = /* @__PURE__ */ new Error(`Request did not complete within ${timeoutInMs} ms`);
				timeoutError.name = "TimeoutError";
				reject(timeoutError);
			}, timeoutInMs);
		});
	}
	const keepAliveSupport = { supported: void 0 };
	var FetchHttpHandler = class FetchHttpHandler {
		config;
		configProvider;
		static create(instanceOrOptions) {
			if (typeof instanceOrOptions?.handle === "function") return instanceOrOptions;
			return new FetchHttpHandler(instanceOrOptions);
		}
		constructor(options) {
			if (typeof options === "function") this.configProvider = options().then((opts) => opts || {});
			else {
				this.config = options ?? {};
				this.configProvider = Promise.resolve(this.config);
			}
			if (keepAliveSupport.supported === void 0) keepAliveSupport.supported = Boolean(typeof Request !== "undefined" && "keepalive" in createRequest("https://[::1]"));
		}
		destroy() {}
		async handle(request, { abortSignal, requestTimeout: requestTimeout$1 } = {}) {
			if (!this.config) this.config = await this.configProvider;
			const requestTimeoutInMs = requestTimeout$1 ?? this.config.requestTimeout;
			const keepAlive = this.config.keepAlive === true;
			const credentials = this.config.credentials;
			if (abortSignal?.aborted) {
				const abortError = /* @__PURE__ */ new Error("Request aborted");
				abortError.name = "AbortError";
				return Promise.reject(abortError);
			}
			let path = request.path;
			const queryString = querystringBuilder.buildQueryString(request.query || {});
			if (queryString) path += `?${queryString}`;
			if (request.fragment) path += `#${request.fragment}`;
			let auth = "";
			if (request.username != null || request.password != null) auth = `${request.username ?? ""}:${request.password ?? ""}@`;
			const { port, method } = request;
			const url = `${request.protocol}//${auth}${request.hostname}${port ? `:${port}` : ""}${path}`;
			const body = method === "GET" || method === "HEAD" ? void 0 : request.body;
			const requestOptions = {
				body,
				headers: new Headers(request.headers),
				method,
				credentials
			};
			if (this.config?.cache) requestOptions.cache = this.config.cache;
			if (body) requestOptions.duplex = "half";
			if (typeof AbortController !== "undefined") requestOptions.signal = abortSignal;
			if (keepAliveSupport.supported) requestOptions.keepalive = keepAlive;
			if (typeof this.config.requestInit === "function") Object.assign(requestOptions, this.config.requestInit(request));
			let removeSignalEventListener = () => {};
			const fetchRequest = createRequest(url, requestOptions);
			const raceOfPromises = [fetch(fetchRequest).then((response) => {
				const fetchHeaders = response.headers;
				const transformedHeaders = {};
				for (const pair of fetchHeaders.entries()) transformedHeaders[pair[0]] = pair[1];
				if (!(response.body != void 0)) return response.blob().then((body$1) => ({ response: new protocolHttp.HttpResponse({
					headers: transformedHeaders,
					reason: response.statusText,
					statusCode: response.status,
					body: body$1
				}) }));
				return { response: new protocolHttp.HttpResponse({
					headers: transformedHeaders,
					reason: response.statusText,
					statusCode: response.status,
					body: response.body
				}) };
			}), requestTimeout(requestTimeoutInMs)];
			if (abortSignal) raceOfPromises.push(new Promise((resolve, reject) => {
				const onAbort = () => {
					const abortError = /* @__PURE__ */ new Error("Request aborted");
					abortError.name = "AbortError";
					reject(abortError);
				};
				if (typeof abortSignal.addEventListener === "function") {
					const signal = abortSignal;
					signal.addEventListener("abort", onAbort, { once: true });
					removeSignalEventListener = () => signal.removeEventListener("abort", onAbort);
				} else abortSignal.onabort = onAbort;
			}));
			return Promise.race(raceOfPromises).finally(removeSignalEventListener);
		}
		updateHttpClientConfig(key, value) {
			this.config = void 0;
			this.configProvider = this.configProvider.then((config) => {
				config[key] = value;
				return config;
			});
		}
		httpHandlerConfigs() {
			return this.config ?? {};
		}
	};
	const streamCollector = async (stream$1) => {
		if (typeof Blob === "function" && stream$1 instanceof Blob || stream$1.constructor?.name === "Blob") {
			if (Blob.prototype.arrayBuffer !== void 0) return new Uint8Array(await stream$1.arrayBuffer());
			return collectBlob(stream$1);
		}
		return collectStream(stream$1);
	};
	async function collectBlob(blob) {
		const base64 = await readToBase64(blob);
		const arrayBuffer = utilBase64.fromBase64(base64);
		return new Uint8Array(arrayBuffer);
	}
	async function collectStream(stream$1) {
		const chunks = [];
		const reader = stream$1.getReader();
		let isDone = false;
		let length = 0;
		while (!isDone) {
			const { done, value } = await reader.read();
			if (value) {
				chunks.push(value);
				length += value.length;
			}
			isDone = done;
		}
		const collected = new Uint8Array(length);
		let offset = 0;
		for (const chunk of chunks) {
			collected.set(chunk, offset);
			offset += chunk.length;
		}
		return collected;
	}
	function readToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.readyState !== 2) return reject(/* @__PURE__ */ new Error("Reader aborted too early"));
				const result = reader.result ?? "";
				const commaIndex = result.indexOf(",");
				const dataOffset = commaIndex > -1 ? commaIndex + 1 : result.length;
				resolve(result.substring(dataOffset));
			};
			reader.onabort = () => reject(/* @__PURE__ */ new Error("Read aborted"));
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(blob);
		});
	}
	exports.FetchHttpHandler = FetchHttpHandler;
	exports.keepAliveSupport = keepAliveSupport;
	exports.streamCollector = streamCollector;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-hex-encoding@4.2.0/node_modules/@smithy/util-hex-encoding/dist-cjs/index.js
var require_dist_cjs$4 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	const SHORT_TO_HEX = {};
	const HEX_TO_SHORT = {};
	for (let i = 0; i < 256; i++) {
		let encodedByte = i.toString(16).toLowerCase();
		if (encodedByte.length === 1) encodedByte = `0${encodedByte}`;
		SHORT_TO_HEX[i] = encodedByte;
		HEX_TO_SHORT[encodedByte] = i;
	}
	function fromHex(encoded) {
		if (encoded.length % 2 !== 0) throw new Error("Hex encoded strings must have an even number length");
		const out = new Uint8Array(encoded.length / 2);
		for (let i = 0; i < encoded.length; i += 2) {
			const encodedByte = encoded.slice(i, i + 2).toLowerCase();
			if (encodedByte in HEX_TO_SHORT) out[i / 2] = HEX_TO_SHORT[encodedByte];
			else throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
		}
		return out;
	}
	function toHex(bytes) {
		let out = "";
		for (let i = 0; i < bytes.byteLength; i++) out += SHORT_TO_HEX[bytes[i]];
		return out;
	}
	exports.fromHex = fromHex;
	exports.toHex = toHex;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/sdk-stream-mixin.browser.js
var require_sdk_stream_mixin_browser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sdkStreamMixin = void 0;
	const fetch_http_handler_1 = require_dist_cjs$5();
	const util_base64_1 = require_dist_cjs$9();
	const util_hex_encoding_1 = require_dist_cjs$4();
	const util_utf8_1 = require_dist_cjs$17.require_dist_cjs();
	const stream_type_check_1 = require_stream_type_check();
	const ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
	const sdkStreamMixin = (stream$1) => {
		if (!isBlobInstance(stream$1) && !(0, stream_type_check_1.isReadableStream)(stream$1)) {
			const name = stream$1?.__proto__?.constructor?.name || stream$1;
			throw new Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${name}`);
		}
		let transformed = false;
		const transformToByteArray = async () => {
			if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
			transformed = true;
			return await (0, fetch_http_handler_1.streamCollector)(stream$1);
		};
		const blobToWebStream = (blob) => {
			if (typeof blob.stream !== "function") throw new Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
			return blob.stream();
		};
		return Object.assign(stream$1, {
			transformToByteArray,
			transformToString: async (encoding) => {
				const buf = await transformToByteArray();
				if (encoding === "base64") return (0, util_base64_1.toBase64)(buf);
				else if (encoding === "hex") return (0, util_hex_encoding_1.toHex)(buf);
				else if (encoding === void 0 || encoding === "utf8" || encoding === "utf-8") return (0, util_utf8_1.toUtf8)(buf);
				else if (typeof TextDecoder === "function") return new TextDecoder(encoding).decode(buf);
				else throw new Error("TextDecoder is not available, please make sure polyfill is provided.");
			},
			transformToWebStream: () => {
				if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
				transformed = true;
				if (isBlobInstance(stream$1)) return blobToWebStream(stream$1);
				else if ((0, stream_type_check_1.isReadableStream)(stream$1)) return stream$1;
				else throw new Error(`Cannot transform payload to web stream, got ${stream$1}`);
			}
		});
	};
	exports.sdkStreamMixin = sdkStreamMixin;
	const isBlobInstance = (stream$1) => typeof Blob === "function" && stream$1 instanceof Blob;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/sdk-stream-mixin.js
var require_sdk_stream_mixin = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sdkStreamMixin = void 0;
	const node_http_handler_1 = require_dist_cjs$6();
	const util_buffer_from_1 = require_dist_cjs$17.require_dist_cjs$1();
	const stream_1$1 = require("stream");
	const sdk_stream_mixin_browser_1 = require_sdk_stream_mixin_browser();
	const ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
	const sdkStreamMixin = (stream$1) => {
		if (!(stream$1 instanceof stream_1$1.Readable)) try {
			return (0, sdk_stream_mixin_browser_1.sdkStreamMixin)(stream$1);
		} catch (e) {
			const name = stream$1?.__proto__?.constructor?.name || stream$1;
			throw new Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${name}`);
		}
		let transformed = false;
		const transformToByteArray = async () => {
			if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
			transformed = true;
			return await (0, node_http_handler_1.streamCollector)(stream$1);
		};
		return Object.assign(stream$1, {
			transformToByteArray,
			transformToString: async (encoding) => {
				const buf = await transformToByteArray();
				if (encoding === void 0 || Buffer.isEncoding(encoding)) return (0, util_buffer_from_1.fromArrayBuffer)(buf.buffer, buf.byteOffset, buf.byteLength).toString(encoding);
				else return new TextDecoder(encoding).decode(buf);
			},
			transformToWebStream: () => {
				if (transformed) throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
				if (stream$1.readableFlowing !== null) throw new Error("The stream has been consumed by other callbacks.");
				if (typeof stream_1$1.Readable.toWeb !== "function") throw new Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
				transformed = true;
				return stream_1$1.Readable.toWeb(stream$1);
			}
		});
	};
	exports.sdkStreamMixin = sdkStreamMixin;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/splitStream.browser.js
var require_splitStream_browser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitStream = splitStream;
	async function splitStream(stream$1) {
		if (typeof stream$1.stream === "function") stream$1 = stream$1.stream();
		return stream$1.tee();
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/splitStream.js
var require_splitStream = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitStream = splitStream;
	const stream_1 = require("stream");
	const splitStream_browser_1 = require_splitStream_browser();
	const stream_type_check_1 = require_stream_type_check();
	async function splitStream(stream$1) {
		if ((0, stream_type_check_1.isReadableStream)(stream$1) || (0, stream_type_check_1.isBlob)(stream$1)) return (0, splitStream_browser_1.splitStream)(stream$1);
		const stream1 = new stream_1.PassThrough();
		const stream2 = new stream_1.PassThrough();
		stream$1.pipe(stream1);
		stream$1.pipe(stream2);
		return [stream1, stream2];
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-stream@4.5.6/node_modules/@smithy/util-stream/dist-cjs/index.js
var require_dist_cjs$3 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilBase64 = require_dist_cjs$9();
	var utilUtf8 = require_dist_cjs$17.require_dist_cjs();
	var ChecksumStream = require_ChecksumStream();
	var createChecksumStream = require_createChecksumStream();
	var createBufferedReadable = require_createBufferedReadable();
	var getAwsChunkedEncodingStream = require_getAwsChunkedEncodingStream();
	var headStream = require_headStream();
	var sdkStreamMixin = require_sdk_stream_mixin();
	var splitStream = require_splitStream();
	var streamTypeCheck = require_stream_type_check();
	var Uint8ArrayBlobAdapter = class Uint8ArrayBlobAdapter extends Uint8Array {
		static fromString(source, encoding = "utf-8") {
			if (typeof source === "string") {
				if (encoding === "base64") return Uint8ArrayBlobAdapter.mutate(utilBase64.fromBase64(source));
				return Uint8ArrayBlobAdapter.mutate(utilUtf8.fromUtf8(source));
			}
			throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
		}
		static mutate(source) {
			Object.setPrototypeOf(source, Uint8ArrayBlobAdapter.prototype);
			return source;
		}
		transformToString(encoding = "utf-8") {
			if (encoding === "base64") return utilBase64.toBase64(this);
			return utilUtf8.toUtf8(this);
		}
	};
	exports.Uint8ArrayBlobAdapter = Uint8ArrayBlobAdapter;
	Object.keys(ChecksumStream).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return ChecksumStream[k];
			}
		});
	});
	Object.keys(createChecksumStream).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return createChecksumStream[k];
			}
		});
	});
	Object.keys(createBufferedReadable).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return createBufferedReadable[k];
			}
		});
	});
	Object.keys(getAwsChunkedEncodingStream).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return getAwsChunkedEncodingStream[k];
			}
		});
	});
	Object.keys(headStream).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return headStream[k];
			}
		});
	});
	Object.keys(sdkStreamMixin).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return sdkStreamMixin[k];
			}
		});
	});
	Object.keys(splitStream).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return splitStream[k];
			}
		});
	});
	Object.keys(streamTypeCheck).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return streamTypeCheck[k];
			}
		});
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
var import_dist_cjs$13, collectBody;
var init_collect_stream_body = require_chunk.__esmMin((() => {
	import_dist_cjs$13 = require_dist_cjs$3();
	collectBody = async (streamBody = new Uint8Array(), context) => {
		if (streamBody instanceof Uint8Array) return import_dist_cjs$13.Uint8ArrayBlobAdapter.mutate(streamBody);
		if (!streamBody) return import_dist_cjs$13.Uint8ArrayBlobAdapter.mutate(new Uint8Array());
		const fromContext = context.streamCollector(streamBody);
		return import_dist_cjs$13.Uint8ArrayBlobAdapter.mutate(await fromContext);
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
function extendedEncodeURIComponent(str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
		return "%" + c.charCodeAt(0).toString(16).toUpperCase();
	});
}
var init_extended_encode_uri_component = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/deref.js
var deref;
var init_deref = require_chunk.__esmMin((() => {
	deref = (schemaRef) => {
		if (typeof schemaRef === "function") return schemaRef();
		return schemaRef;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/operation.js
var operation;
var init_operation = require_chunk.__esmMin((() => {
	operation = (namespace, name, traits, input, output) => ({
		name,
		namespace,
		traits,
		input,
		output
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/middleware/schemaDeserializationMiddleware.js
var import_dist_cjs$11, import_dist_cjs$12, schemaDeserializationMiddleware, findHeader;
var init_schemaDeserializationMiddleware = require_chunk.__esmMin((() => {
	import_dist_cjs$11 = require_dist_cjs$16.require_dist_cjs();
	import_dist_cjs$12 = require_dist_cjs$10();
	init_operation();
	schemaDeserializationMiddleware = (config) => (next, context) => async (args) => {
		const { response } = await next(args);
		const { operationSchema } = (0, import_dist_cjs$12.getSmithyContext)(context);
		const [, ns, n, t, i, o] = operationSchema ?? [];
		try {
			return {
				response,
				output: await config.protocol.deserializeResponse(operation(ns, n, t, i, o), {
					...config,
					...context
				}, response)
			};
		} catch (error$1) {
			Object.defineProperty(error$1, "$response", {
				value: response,
				enumerable: false,
				writable: false,
				configurable: false
			});
			if (!("$metadata" in error$1)) {
				const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
				try {
					error$1.message += "\n  " + hint;
				} catch (e) {
					if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") console.warn(hint);
					else context.logger?.warn?.(hint);
				}
				if (typeof error$1.$responseBodyText !== "undefined") {
					if (error$1.$response) error$1.$response.body = error$1.$responseBodyText;
				}
				try {
					if (import_dist_cjs$11.HttpResponse.isInstance(response)) {
						const { headers = {} } = response;
						const headerEntries = Object.entries(headers);
						error$1.$metadata = {
							httpStatusCode: response.statusCode,
							requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
							extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
							cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
						};
					}
				} catch (e) {}
			}
			throw error$1;
		}
	};
	findHeader = (pattern, headers) => {
		return (headers.find(([k]) => {
			return k.match(pattern);
		}) || [void 0, void 0])[1];
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/middleware/schemaSerializationMiddleware.js
var import_dist_cjs$10, schemaSerializationMiddleware;
var init_schemaSerializationMiddleware = require_chunk.__esmMin((() => {
	import_dist_cjs$10 = require_dist_cjs$10();
	init_operation();
	schemaSerializationMiddleware = (config) => (next, context) => async (args) => {
		const { operationSchema } = (0, import_dist_cjs$10.getSmithyContext)(context);
		const [, ns, n, t, i, o] = operationSchema ?? [];
		const endpoint = context.endpointV2?.url && config.urlParser ? async () => config.urlParser(context.endpointV2.url) : config.endpoint;
		const request = await config.protocol.serializeRequest(operation(ns, n, t, i, o), args.input, {
			...config,
			...context,
			endpoint
		});
		return next({
			...args,
			request
		});
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/middleware/getSchemaSerdePlugin.js
function getSchemaSerdePlugin(config) {
	return { applyToStack: (commandStack) => {
		commandStack.add(schemaSerializationMiddleware(config), serializerMiddlewareOption);
		commandStack.add(schemaDeserializationMiddleware(config), deserializerMiddlewareOption);
		config.protocol.setSerdeContext(config);
	} };
}
var deserializerMiddlewareOption, serializerMiddlewareOption;
var init_getSchemaSerdePlugin = require_chunk.__esmMin((() => {
	init_schemaDeserializationMiddleware();
	init_schemaSerializationMiddleware();
	deserializerMiddlewareOption = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: true
	};
	serializerMiddlewareOption = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: true
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/Schema.js
var Schema;
var init_Schema = require_chunk.__esmMin((() => {
	Schema = class {
		name;
		namespace;
		traits;
		static assign(instance, values) {
			return Object.assign(instance, values);
		}
		static [Symbol.hasInstance](lhs) {
			const isPrototype = this.prototype.isPrototypeOf(lhs);
			if (!isPrototype && typeof lhs === "object" && lhs !== null) return lhs.symbol === this.symbol;
			return isPrototype;
		}
		getName() {
			return this.namespace + "#" + this.name;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/ListSchema.js
var ListSchema, list;
var init_ListSchema = require_chunk.__esmMin((() => {
	init_Schema();
	ListSchema = class ListSchema extends Schema {
		static symbol = Symbol.for("@smithy/lis");
		name;
		traits;
		valueSchema;
		symbol = ListSchema.symbol;
	};
	list = (namespace, name, traits, valueSchema) => Schema.assign(new ListSchema(), {
		name,
		namespace,
		traits,
		valueSchema
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/MapSchema.js
var MapSchema, map;
var init_MapSchema = require_chunk.__esmMin((() => {
	init_Schema();
	MapSchema = class MapSchema extends Schema {
		static symbol = Symbol.for("@smithy/map");
		name;
		traits;
		keySchema;
		valueSchema;
		symbol = MapSchema.symbol;
	};
	map = (namespace, name, traits, keySchema, valueSchema) => Schema.assign(new MapSchema(), {
		name,
		namespace,
		traits,
		keySchema,
		valueSchema
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/OperationSchema.js
var OperationSchema, op;
var init_OperationSchema = require_chunk.__esmMin((() => {
	init_Schema();
	OperationSchema = class OperationSchema extends Schema {
		static symbol = Symbol.for("@smithy/ope");
		name;
		traits;
		input;
		output;
		symbol = OperationSchema.symbol;
	};
	op = (namespace, name, traits, input, output) => Schema.assign(new OperationSchema(), {
		name,
		namespace,
		traits,
		input,
		output
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/StructureSchema.js
var StructureSchema, struct;
var init_StructureSchema = require_chunk.__esmMin((() => {
	init_Schema();
	StructureSchema = class StructureSchema extends Schema {
		static symbol = Symbol.for("@smithy/str");
		name;
		traits;
		memberNames;
		memberList;
		symbol = StructureSchema.symbol;
	};
	struct = (namespace, name, traits, memberNames, memberList) => Schema.assign(new StructureSchema(), {
		name,
		namespace,
		traits,
		memberNames,
		memberList
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/ErrorSchema.js
var ErrorSchema, error;
var init_ErrorSchema = require_chunk.__esmMin((() => {
	init_Schema();
	init_StructureSchema();
	ErrorSchema = class ErrorSchema extends StructureSchema {
		static symbol = Symbol.for("@smithy/err");
		ctor;
		symbol = ErrorSchema.symbol;
	};
	error = (namespace, name, traits, memberNames, memberList, ctor) => Schema.assign(new ErrorSchema(), {
		name,
		namespace,
		traits,
		memberNames,
		memberList,
		ctor: null
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/translateTraits.js
function translateTraits(indicator) {
	if (typeof indicator === "object") return indicator;
	indicator = indicator | 0;
	const traits = {};
	let i = 0;
	for (const trait of [
		"httpLabel",
		"idempotent",
		"idempotencyToken",
		"sensitive",
		"httpPayload",
		"httpResponseCode",
		"httpQueryParams"
	]) if ((indicator >> i++ & 1) === 1) traits[trait] = 1;
	return traits;
}
var init_translateTraits = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js
function member(memberSchema, memberName) {
	if (memberSchema instanceof NormalizedSchema) return Object.assign(memberSchema, {
		memberName,
		_isMemberSchema: true
	});
	return new NormalizedSchema(memberSchema, memberName);
}
var NormalizedSchema, isMemberSchema, isStaticSchema;
var init_NormalizedSchema = require_chunk.__esmMin((() => {
	init_deref();
	init_translateTraits();
	NormalizedSchema = class NormalizedSchema {
		ref;
		memberName;
		static symbol = Symbol.for("@smithy/nor");
		symbol = NormalizedSchema.symbol;
		name;
		schema;
		_isMemberSchema;
		traits;
		memberTraits;
		normalizedTraits;
		constructor(ref, memberName) {
			this.ref = ref;
			this.memberName = memberName;
			const traitStack = [];
			let _ref = ref;
			let schema = ref;
			this._isMemberSchema = false;
			while (isMemberSchema(_ref)) {
				traitStack.push(_ref[1]);
				_ref = _ref[0];
				schema = deref(_ref);
				this._isMemberSchema = true;
			}
			if (traitStack.length > 0) {
				this.memberTraits = {};
				for (let i = traitStack.length - 1; i >= 0; --i) {
					const traitSet = traitStack[i];
					Object.assign(this.memberTraits, translateTraits(traitSet));
				}
			} else this.memberTraits = 0;
			if (schema instanceof NormalizedSchema) {
				const computedMemberTraits = this.memberTraits;
				Object.assign(this, schema);
				this.memberTraits = Object.assign({}, computedMemberTraits, schema.getMemberTraits(), this.getMemberTraits());
				this.normalizedTraits = void 0;
				this.memberName = memberName ?? schema.memberName;
				return;
			}
			this.schema = deref(schema);
			if (isStaticSchema(this.schema)) {
				this.name = `${this.schema[1]}#${this.schema[2]}`;
				this.traits = this.schema[3];
			} else {
				this.name = this.memberName ?? String(schema);
				this.traits = 0;
			}
			if (this._isMemberSchema && !memberName) throw new Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(true)} missing member name.`);
		}
		static [Symbol.hasInstance](lhs) {
			const isPrototype = this.prototype.isPrototypeOf(lhs);
			if (!isPrototype && typeof lhs === "object" && lhs !== null) return lhs.symbol === this.symbol;
			return isPrototype;
		}
		static of(ref) {
			const sc = deref(ref);
			if (sc instanceof NormalizedSchema) return sc;
			if (isMemberSchema(sc)) {
				const [ns, traits] = sc;
				if (ns instanceof NormalizedSchema) {
					Object.assign(ns.getMergedTraits(), translateTraits(traits));
					return ns;
				}
				throw new Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(ref, null, 2)}.`);
			}
			return new NormalizedSchema(sc);
		}
		getSchema() {
			const sc = this.schema;
			if (sc[0] === 0) return sc[4];
			return sc;
		}
		getName(withNamespace = false) {
			const { name } = this;
			return !withNamespace && name && name.includes("#") ? name.split("#")[1] : name || void 0;
		}
		getMemberName() {
			return this.memberName;
		}
		isMemberSchema() {
			return this._isMemberSchema;
		}
		isListSchema() {
			const sc = this.getSchema();
			return typeof sc === "number" ? sc >= 64 && sc < 128 : sc[0] === 1;
		}
		isMapSchema() {
			const sc = this.getSchema();
			return typeof sc === "number" ? sc >= 128 && sc <= 255 : sc[0] === 2;
		}
		isStructSchema() {
			const sc = this.getSchema();
			return sc[0] === 3 || sc[0] === -3;
		}
		isBlobSchema() {
			const sc = this.getSchema();
			return sc === 21 || sc === 42;
		}
		isTimestampSchema() {
			const sc = this.getSchema();
			return typeof sc === "number" && sc >= 4 && sc <= 7;
		}
		isUnitSchema() {
			return this.getSchema() === "unit";
		}
		isDocumentSchema() {
			return this.getSchema() === 15;
		}
		isStringSchema() {
			return this.getSchema() === 0;
		}
		isBooleanSchema() {
			return this.getSchema() === 2;
		}
		isNumericSchema() {
			return this.getSchema() === 1;
		}
		isBigIntegerSchema() {
			return this.getSchema() === 17;
		}
		isBigDecimalSchema() {
			return this.getSchema() === 19;
		}
		isStreaming() {
			const { streaming } = this.getMergedTraits();
			return !!streaming || this.getSchema() === 42;
		}
		isIdempotencyToken() {
			const match = (traits$1) => (traits$1 & 4) === 4 || !!traits$1?.idempotencyToken;
			const { normalizedTraits, traits, memberTraits } = this;
			return match(normalizedTraits) || match(traits) || match(memberTraits);
		}
		getMergedTraits() {
			return this.normalizedTraits ?? (this.normalizedTraits = {
				...this.getOwnTraits(),
				...this.getMemberTraits()
			});
		}
		getMemberTraits() {
			return translateTraits(this.memberTraits);
		}
		getOwnTraits() {
			return translateTraits(this.traits);
		}
		getKeySchema() {
			const [isDoc, isMap] = [this.isDocumentSchema(), this.isMapSchema()];
			if (!isDoc && !isMap) throw new Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(true)}`);
			const schema = this.getSchema();
			return member([isDoc ? 15 : schema[4] ?? 0, 0], "key");
		}
		getValueSchema() {
			const sc = this.getSchema();
			const [isDoc, isMap, isList] = [
				this.isDocumentSchema(),
				this.isMapSchema(),
				this.isListSchema()
			];
			const memberSchema = typeof sc === "number" ? 63 & sc : sc && typeof sc === "object" && (isMap || isList) ? sc[3 + sc[0]] : isDoc ? 15 : void 0;
			if (memberSchema != null) return member([memberSchema, 0], isMap ? "value" : "member");
			throw new Error(`@smithy/core/schema - ${this.getName(true)} has no value member.`);
		}
		getMemberSchema(memberName) {
			const struct$1 = this.getSchema();
			if (this.isStructSchema() && struct$1[4].includes(memberName)) {
				const i = struct$1[4].indexOf(memberName);
				const memberSchema = struct$1[5][i];
				return member(isMemberSchema(memberSchema) ? memberSchema : [memberSchema, 0], memberName);
			}
			if (this.isDocumentSchema()) return member([15, 0], memberName);
			throw new Error(`@smithy/core/schema - ${this.getName(true)} has no no member=${memberName}.`);
		}
		getMemberSchemas() {
			const buffer = {};
			try {
				for (const [k, v] of this.structIterator()) buffer[k] = v;
			} catch (ignored) {}
			return buffer;
		}
		getEventStreamMember() {
			if (this.isStructSchema()) {
				for (const [memberName, memberSchema] of this.structIterator()) if (memberSchema.isStreaming() && memberSchema.isStructSchema()) return memberName;
			}
			return "";
		}
		*structIterator() {
			if (this.isUnitSchema()) return;
			if (!this.isStructSchema()) throw new Error("@smithy/core/schema - cannot iterate non-struct schema.");
			const struct$1 = this.getSchema();
			for (let i = 0; i < struct$1[4].length; ++i) yield [struct$1[4][i], member([struct$1[5][i], 0], struct$1[4][i])];
		}
	};
	isMemberSchema = (sc) => Array.isArray(sc) && sc.length === 2;
	isStaticSchema = (sc) => Array.isArray(sc) && sc.length >= 5;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/SimpleSchema.js
var SimpleSchema, sim, simAdapter;
var init_SimpleSchema = require_chunk.__esmMin((() => {
	init_Schema();
	SimpleSchema = class SimpleSchema extends Schema {
		static symbol = Symbol.for("@smithy/sim");
		name;
		schemaRef;
		traits;
		symbol = SimpleSchema.symbol;
	};
	sim = (namespace, name, schemaRef, traits) => Schema.assign(new SimpleSchema(), {
		name,
		namespace,
		traits,
		schemaRef
	});
	simAdapter = (namespace, name, traits, schemaRef) => Schema.assign(new SimpleSchema(), {
		name,
		namespace,
		traits,
		schemaRef
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/schemas/sentinels.js
var SCHEMA;
var init_sentinels = require_chunk.__esmMin((() => {
	SCHEMA = {
		BLOB: 21,
		STREAMING_BLOB: 42,
		BOOLEAN: 2,
		STRING: 0,
		NUMERIC: 1,
		BIG_INTEGER: 17,
		BIG_DECIMAL: 19,
		DOCUMENT: 15,
		TIMESTAMP_DEFAULT: 4,
		TIMESTAMP_DATE_TIME: 5,
		TIMESTAMP_HTTP_DATE: 6,
		TIMESTAMP_EPOCH_SECONDS: 7,
		LIST_MODIFIER: 64,
		MAP_MODIFIER: 128
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/TypeRegistry.js
var TypeRegistry;
var init_TypeRegistry = require_chunk.__esmMin((() => {
	TypeRegistry = class TypeRegistry {
		namespace;
		schemas;
		exceptions;
		static registries = /* @__PURE__ */ new Map();
		constructor(namespace, schemas = /* @__PURE__ */ new Map(), exceptions = /* @__PURE__ */ new Map()) {
			this.namespace = namespace;
			this.schemas = schemas;
			this.exceptions = exceptions;
		}
		static for(namespace) {
			if (!TypeRegistry.registries.has(namespace)) TypeRegistry.registries.set(namespace, new TypeRegistry(namespace));
			return TypeRegistry.registries.get(namespace);
		}
		register(shapeId, schema) {
			const qualifiedName = this.normalizeShapeId(shapeId);
			TypeRegistry.for(qualifiedName.split("#")[0]).schemas.set(qualifiedName, schema);
		}
		getSchema(shapeId) {
			const id = this.normalizeShapeId(shapeId);
			if (!this.schemas.has(id)) throw new Error(`@smithy/core/schema - schema not found for ${id}`);
			return this.schemas.get(id);
		}
		registerError(es, ctor) {
			const $error = es;
			const registry = TypeRegistry.for($error[1]);
			registry.schemas.set($error[1] + "#" + $error[2], $error);
			registry.exceptions.set($error, ctor);
		}
		getErrorCtor(es) {
			const $error = es;
			return TypeRegistry.for($error[1]).exceptions.get($error);
		}
		getBaseException() {
			for (const exceptionKey of this.exceptions.keys()) if (Array.isArray(exceptionKey)) {
				const [, ns, name] = exceptionKey;
				const id = ns + "#" + name;
				if (id.startsWith("smithy.ts.sdk.synthetic.") && id.endsWith("ServiceException")) return exceptionKey;
			}
		}
		find(predicate) {
			return [...this.schemas.values()].find(predicate);
		}
		clear() {
			this.schemas.clear();
			this.exceptions.clear();
		}
		normalizeShapeId(shapeId) {
			if (shapeId.includes("#")) return shapeId;
			return this.namespace + "#" + shapeId;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/schema/index.js
var schema_exports = /* @__PURE__ */ require_chunk.__exportAll({
	ErrorSchema: () => ErrorSchema,
	ListSchema: () => ListSchema,
	MapSchema: () => MapSchema,
	NormalizedSchema: () => NormalizedSchema,
	OperationSchema: () => OperationSchema,
	SCHEMA: () => SCHEMA,
	Schema: () => Schema,
	SimpleSchema: () => SimpleSchema,
	StructureSchema: () => StructureSchema,
	TypeRegistry: () => TypeRegistry,
	deref: () => deref,
	deserializerMiddlewareOption: () => deserializerMiddlewareOption,
	error: () => error,
	getSchemaSerdePlugin: () => getSchemaSerdePlugin,
	isStaticSchema: () => isStaticSchema,
	list: () => list,
	map: () => map,
	op: () => op,
	operation: () => operation,
	serializerMiddlewareOption: () => serializerMiddlewareOption,
	sim: () => sim,
	simAdapter: () => simAdapter,
	struct: () => struct,
	translateTraits: () => translateTraits
});
var init_schema = require_chunk.__esmMin((() => {
	init_deref();
	init_getSchemaSerdePlugin();
	init_ListSchema();
	init_MapSchema();
	init_OperationSchema();
	init_operation();
	init_ErrorSchema();
	init_NormalizedSchema();
	init_Schema();
	init_SimpleSchema();
	init_StructureSchema();
	init_sentinels();
	init_translateTraits();
	init_TypeRegistry();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/copyDocumentWithTransform.js
var copyDocumentWithTransform;
var init_copyDocumentWithTransform = require_chunk.__esmMin((() => {
	copyDocumentWithTransform = (source, schemaRef, transform = (_) => _) => source;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/parse-utils.js
var parseBoolean, expectBoolean, expectNumber, MAX_FLOAT, expectFloat32, expectLong, expectInt, expectInt32, expectShort, expectByte, expectSizedInt, castInt, expectNonNull, expectObject, expectString, expectUnion, strictParseDouble, strictParseFloat, strictParseFloat32, NUMBER_REGEX, parseNumber, limitedParseDouble, handleFloat, limitedParseFloat, limitedParseFloat32, parseFloatString, strictParseLong, strictParseInt, strictParseInt32, strictParseShort, strictParseByte, stackTraceWarning, logger;
var init_parse_utils = require_chunk.__esmMin((() => {
	parseBoolean = (value) => {
		switch (value) {
			case "true": return true;
			case "false": return false;
			default: throw new Error(`Unable to parse boolean value "${value}"`);
		}
	};
	expectBoolean = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "number") {
			if (value === 0 || value === 1) logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
			if (value === 0) return false;
			if (value === 1) return true;
		}
		if (typeof value === "string") {
			const lower = value.toLowerCase();
			if (lower === "false" || lower === "true") logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
			if (lower === "false") return false;
			if (lower === "true") return true;
		}
		if (typeof value === "boolean") return value;
		throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
	};
	expectNumber = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "string") {
			const parsed = parseFloat(value);
			if (!Number.isNaN(parsed)) {
				if (String(parsed) !== String(value)) logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
				return parsed;
			}
		}
		if (typeof value === "number") return value;
		throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
	};
	MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
	expectFloat32 = (value) => {
		const expected = expectNumber(value);
		if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
			if (Math.abs(expected) > MAX_FLOAT) throw new TypeError(`Expected 32-bit float, got ${value}`);
		}
		return expected;
	};
	expectLong = (value) => {
		if (value === null || value === void 0) return;
		if (Number.isInteger(value) && !Number.isNaN(value)) return value;
		throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
	};
	expectInt = expectLong;
	expectInt32 = (value) => expectSizedInt(value, 32);
	expectShort = (value) => expectSizedInt(value, 16);
	expectByte = (value) => expectSizedInt(value, 8);
	expectSizedInt = (value, size) => {
		const expected = expectLong(value);
		if (expected !== void 0 && castInt(expected, size) !== expected) throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
		return expected;
	};
	castInt = (value, size) => {
		switch (size) {
			case 32: return Int32Array.of(value)[0];
			case 16: return Int16Array.of(value)[0];
			case 8: return Int8Array.of(value)[0];
		}
	};
	expectNonNull = (value, location) => {
		if (value === null || value === void 0) {
			if (location) throw new TypeError(`Expected a non-null value for ${location}`);
			throw new TypeError("Expected a non-null value");
		}
		return value;
	};
	expectObject = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "object" && !Array.isArray(value)) return value;
		const receivedType = Array.isArray(value) ? "array" : typeof value;
		throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
	};
	expectString = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value === "string") return value;
		if ([
			"boolean",
			"number",
			"bigint"
		].includes(typeof value)) {
			logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
			return String(value);
		}
		throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
	};
	expectUnion = (value) => {
		if (value === null || value === void 0) return;
		const asObject = expectObject(value);
		const setKeys = Object.entries(asObject).filter(([, v]) => v != null).map(([k]) => k);
		if (setKeys.length === 0) throw new TypeError(`Unions must have exactly one non-null member. None were found.`);
		if (setKeys.length > 1) throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
		return asObject;
	};
	strictParseDouble = (value) => {
		if (typeof value == "string") return expectNumber(parseNumber(value));
		return expectNumber(value);
	};
	strictParseFloat = strictParseDouble;
	strictParseFloat32 = (value) => {
		if (typeof value == "string") return expectFloat32(parseNumber(value));
		return expectFloat32(value);
	};
	NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
	parseNumber = (value) => {
		const matches = value.match(NUMBER_REGEX);
		if (matches === null || matches[0].length !== value.length) throw new TypeError(`Expected real number, got implicit NaN`);
		return parseFloat(value);
	};
	limitedParseDouble = (value) => {
		if (typeof value == "string") return parseFloatString(value);
		return expectNumber(value);
	};
	handleFloat = limitedParseDouble;
	limitedParseFloat = limitedParseDouble;
	limitedParseFloat32 = (value) => {
		if (typeof value == "string") return parseFloatString(value);
		return expectFloat32(value);
	};
	parseFloatString = (value) => {
		switch (value) {
			case "NaN": return NaN;
			case "Infinity": return Infinity;
			case "-Infinity": return -Infinity;
			default: throw new Error(`Unable to parse float value: ${value}`);
		}
	};
	strictParseLong = (value) => {
		if (typeof value === "string") return expectLong(parseNumber(value));
		return expectLong(value);
	};
	strictParseInt = strictParseLong;
	strictParseInt32 = (value) => {
		if (typeof value === "string") return expectInt32(parseNumber(value));
		return expectInt32(value);
	};
	strictParseShort = (value) => {
		if (typeof value === "string") return expectShort(parseNumber(value));
		return expectShort(value);
	};
	strictParseByte = (value) => {
		if (typeof value === "string") return expectByte(parseNumber(value));
		return expectByte(value);
	};
	stackTraceWarning = (message) => {
		return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s) => !s.includes("stackTraceWarning")).join("\n");
	};
	logger = { warn: console.warn };
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/date-utils.js
function dateToUtcString(date$1) {
	const year$1 = date$1.getUTCFullYear();
	const month = date$1.getUTCMonth();
	const dayOfWeek = date$1.getUTCDay();
	const dayOfMonthInt = date$1.getUTCDate();
	const hoursInt = date$1.getUTCHours();
	const minutesInt = date$1.getUTCMinutes();
	const secondsInt = date$1.getUTCSeconds();
	const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
	const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
	const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
	const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
	return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year$1} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
var DAYS, MONTHS, RFC3339, parseRfc3339DateTime, RFC3339_WITH_OFFSET$1, parseRfc3339DateTimeWithOffset, IMF_FIXDATE$1, RFC_850_DATE$1, ASC_TIME$1, parseRfc7231DateTime, parseEpochTimestamp, buildDate, parseTwoDigitYear, FIFTY_YEARS_IN_MILLIS, adjustRfc850Year, parseMonthByShortName, DAYS_IN_MONTH, validateDayOfMonth, isLeapYear, parseDateValue, parseMilliseconds, parseOffsetToMilliseconds, stripLeadingZeroes;
var init_date_utils = require_chunk.__esmMin((() => {
	init_parse_utils();
	DAYS = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	MONTHS = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	RFC3339 = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
	parseRfc3339DateTime = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value !== "string") throw new TypeError("RFC-3339 date-times must be expressed as strings");
		const match = RFC3339.exec(value);
		if (!match) throw new TypeError("Invalid RFC-3339 date-time value");
		const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds] = match;
		return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseDateValue(monthStr, "month", 1, 12), parseDateValue(dayStr, "day", 1, 31), {
			hours,
			minutes,
			seconds,
			fractionalMilliseconds
		});
	};
	RFC3339_WITH_OFFSET$1 = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
	parseRfc3339DateTimeWithOffset = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value !== "string") throw new TypeError("RFC-3339 date-times must be expressed as strings");
		const match = RFC3339_WITH_OFFSET$1.exec(value);
		if (!match) throw new TypeError("Invalid RFC-3339 date-time value");
		const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
		const date$1 = buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseDateValue(monthStr, "month", 1, 12), parseDateValue(dayStr, "day", 1, 31), {
			hours,
			minutes,
			seconds,
			fractionalMilliseconds
		});
		if (offsetStr.toUpperCase() != "Z") date$1.setTime(date$1.getTime() - parseOffsetToMilliseconds(offsetStr));
		return date$1;
	};
	IMF_FIXDATE$1 = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
	RFC_850_DATE$1 = /* @__PURE__ */ new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
	ASC_TIME$1 = /* @__PURE__ */ new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
	parseRfc7231DateTime = (value) => {
		if (value === null || value === void 0) return;
		if (typeof value !== "string") throw new TypeError("RFC-7231 date-times must be expressed as strings");
		let match = IMF_FIXDATE$1.exec(value);
		if (match) {
			const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
			return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
				hours,
				minutes,
				seconds,
				fractionalMilliseconds
			});
		}
		match = RFC_850_DATE$1.exec(value);
		if (match) {
			const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
			return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
				hours,
				minutes,
				seconds,
				fractionalMilliseconds
			}));
		}
		match = ASC_TIME$1.exec(value);
		if (match) {
			const [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
			return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), {
				hours,
				minutes,
				seconds,
				fractionalMilliseconds
			});
		}
		throw new TypeError("Invalid RFC-7231 date-time value");
	};
	parseEpochTimestamp = (value) => {
		if (value === null || value === void 0) return;
		let valueAsDouble;
		if (typeof value === "number") valueAsDouble = value;
		else if (typeof value === "string") valueAsDouble = strictParseDouble(value);
		else if (typeof value === "object" && value.tag === 1) valueAsDouble = value.value;
		else throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
		if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
		return new Date(Math.round(valueAsDouble * 1e3));
	};
	buildDate = (year$1, month, day, time$1) => {
		const adjustedMonth = month - 1;
		validateDayOfMonth(year$1, adjustedMonth, day);
		return new Date(Date.UTC(year$1, adjustedMonth, day, parseDateValue(time$1.hours, "hour", 0, 23), parseDateValue(time$1.minutes, "minute", 0, 59), parseDateValue(time$1.seconds, "seconds", 0, 60), parseMilliseconds(time$1.fractionalMilliseconds)));
	};
	parseTwoDigitYear = (value) => {
		const thisYear = (/* @__PURE__ */ new Date()).getUTCFullYear();
		const valueInThisCentury = Math.floor(thisYear / 100) * 100 + strictParseShort(stripLeadingZeroes(value));
		if (valueInThisCentury < thisYear) return valueInThisCentury + 100;
		return valueInThisCentury;
	};
	FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
	adjustRfc850Year = (input) => {
		if (input.getTime() - (/* @__PURE__ */ new Date()).getTime() > FIFTY_YEARS_IN_MILLIS) return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
		return input;
	};
	parseMonthByShortName = (value) => {
		const monthIdx = MONTHS.indexOf(value);
		if (monthIdx < 0) throw new TypeError(`Invalid month: ${value}`);
		return monthIdx + 1;
	};
	DAYS_IN_MONTH = [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	validateDayOfMonth = (year$1, month, day) => {
		let maxDays = DAYS_IN_MONTH[month];
		if (month === 1 && isLeapYear(year$1)) maxDays = 29;
		if (day > maxDays) throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year$1}: ${day}`);
	};
	isLeapYear = (year$1) => {
		return year$1 % 4 === 0 && (year$1 % 100 !== 0 || year$1 % 400 === 0);
	};
	parseDateValue = (value, type, lower, upper) => {
		const dateVal = strictParseByte(stripLeadingZeroes(value));
		if (dateVal < lower || dateVal > upper) throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
		return dateVal;
	};
	parseMilliseconds = (value) => {
		if (value === null || value === void 0) return 0;
		return strictParseFloat32("0." + value) * 1e3;
	};
	parseOffsetToMilliseconds = (value) => {
		const directionStr = value[0];
		let direction = 1;
		if (directionStr == "+") direction = 1;
		else if (directionStr == "-") direction = -1;
		else throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
		const hour = Number(value.substring(1, 3));
		const minute = Number(value.substring(4, 6));
		return direction * (hour * 60 + minute) * 60 * 1e3;
	};
	stripLeadingZeroes = (value) => {
		let idx = 0;
		while (idx < value.length - 1 && value.charAt(idx) === "0") idx++;
		if (idx === 0) return value;
		return value.slice(idx);
	};
}));

//#endregion
//#region ../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = /* @__PURE__ */ require_chunk.__exportAll({
	__addDisposableResource: () => __addDisposableResource,
	__assign: () => __assign,
	__asyncDelegator: () => __asyncDelegator,
	__asyncGenerator: () => __asyncGenerator,
	__asyncValues: () => __asyncValues,
	__await: () => __await,
	__awaiter: () => __awaiter,
	__classPrivateFieldGet: () => __classPrivateFieldGet,
	__classPrivateFieldIn: () => __classPrivateFieldIn,
	__classPrivateFieldSet: () => __classPrivateFieldSet,
	__createBinding: () => __createBinding,
	__decorate: () => __decorate,
	__disposeResources: () => __disposeResources,
	__esDecorate: () => __esDecorate,
	__exportStar: () => __exportStar,
	__extends: () => __extends,
	__generator: () => __generator,
	__importDefault: () => __importDefault,
	__importStar: () => __importStar,
	__makeTemplateObject: () => __makeTemplateObject,
	__metadata: () => __metadata,
	__param: () => __param,
	__propKey: () => __propKey,
	__read: () => __read,
	__rest: () => __rest,
	__rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
	__runInitializers: () => __runInitializers,
	__setFunctionName: () => __setFunctionName,
	__spread: () => __spread,
	__spreadArray: () => __spreadArray,
	__spreadArrays: () => __spreadArrays,
	__values: () => __values,
	default: () => tslib_es6_default
});
function __extends(d, b) {
	if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
}
function __runInitializers(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
}
function __propKey(x) {
	return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
	if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
	return Object.defineProperty(f, "name", {
		configurable: true,
		value: prefix ? "".concat(prefix, " ", name) : name
	});
}
function __metadata(metadataKey, metadataValue) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
	return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op$1) {
		if (f) throw new TypeError("Generator is already executing.");
		while (g && (g = 0, op$1[0] && (_ = 0)), _) try {
			if (f = 1, y && (t = op$1[0] & 2 ? y["return"] : op$1[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op$1[1])).done) return t;
			if (y = 0, t) op$1 = [op$1[0] & 2, t.value];
			switch (op$1[0]) {
				case 0:
				case 1:
					t = op$1;
					break;
				case 4:
					_.label++;
					return {
						value: op$1[1],
						done: false
					};
				case 5:
					_.label++;
					y = op$1[1];
					op$1 = [0];
					continue;
				case 7:
					op$1 = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op$1[0] === 6 || op$1[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op$1[0] === 3 && (!t || op$1[1] > t[0] && op$1[1] < t[3])) {
						_.label = op$1[1];
						break;
					}
					if (op$1[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op$1;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op$1);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op$1 = body.call(thisArg, _);
		} catch (e) {
			op$1 = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op$1[0] & 5) throw op$1[1];
		return {
			value: op$1[0] ? op$1[1] : void 0,
			done: true
		};
	}
}
function __exportStar(m, o) {
	for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error$1) {
		e = { error: error$1 };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
}
/** @deprecated */
function __spread() {
	for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	return ar;
}
/** @deprecated */
function __spreadArrays() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
	return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var g = generator.apply(thisArg, _arguments || []), i, q = [];
	return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function awaitReturn(f) {
		return function(v) {
			return Promise.resolve(v).then(f, reject);
		};
	}
	function verb(n, f) {
		if (g[n]) {
			i[n] = function(v) {
				return new Promise(function(a, b) {
					q.push([
						n,
						v,
						a,
						b
					]) > 1 || resume(n, v);
				});
			};
			if (f) i[n] = f(i[n]);
		}
	}
	function resume(n, v) {
		try {
			step(g[n](v));
		} catch (e) {
			settle(q[0][3], e);
		}
	}
	function step(r) {
		r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
	}
	function fulfill(value) {
		resume("next", value);
	}
	function reject(value) {
		resume("throw", value);
	}
	function settle(f, v) {
		if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
	}
}
function __asyncDelegator(o) {
	var i, p;
	return i = {}, verb("next"), verb("throw", function(e) {
		throw e;
	}), verb("return"), i[Symbol.iterator] = function() {
		return this;
	}, i;
	function verb(n, f) {
		i[n] = o[n] ? function(v) {
			return (p = !p) ? {
				value: __await(o[n](v)),
				done: false
			} : f ? f(v) : v;
		} : f;
	}
}
function __asyncValues(o) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var m = o[Symbol.asyncIterator], i;
	return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i);
	function verb(n) {
		i[n] = o[n] && function(v) {
			return new Promise(function(resolve, reject) {
				v = o[n](v), settle(resolve, reject, v.done, v.value);
			});
		};
	}
	function settle(resolve, reject, d, v) {
		Promise.resolve(v).then(function(v$1) {
			resolve({
				value: v$1,
				done: d
			});
		}, reject);
	}
}
function __makeTemplateObject(cooked, raw) {
	if (Object.defineProperty) Object.defineProperty(cooked, "raw", { value: raw });
	else cooked.raw = raw;
	return cooked;
}
function __importStar(mod) {
	if (mod && mod.__esModule) return mod;
	var result = {};
	if (mod != null) {
		for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	}
	__setModuleDefault(result, mod);
	return result;
}
function __importDefault(mod) {
	return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
	if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
	return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
}
function __disposeResources(env) {
	function fail(e) {
		env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
		env.hasError = true;
	}
	var r, s = 0;
	function next() {
		while (r = env.stack.pop()) try {
			if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
			if (r.dispose) {
				var result = r.dispose.call(r.value);
				if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
					fail(e);
					return next();
				});
			} else s |= 1;
		} catch (e) {
			fail(e);
		}
		if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
		if (env.hasError) throw env.error;
	}
	return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
}
var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = require_chunk.__esmMin((() => {
	extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
			d$1.__proto__ = b$1;
		} || function(d$1, b$1) {
			for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
		};
		return extendStatics(d, b);
	};
	__assign = function() {
		__assign = Object.assign || function __assign$1(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	__createBinding = Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	__setModuleDefault = Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	};
	ownKeys = function(o) {
		ownKeys = Object.getOwnPropertyNames || function(o$1) {
			var ar = [];
			for (var k in o$1) if (Object.prototype.hasOwnProperty.call(o$1, k)) ar[ar.length] = k;
			return ar;
		};
		return ownKeys(o);
	};
	_SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error$1, suppressed, message) {
		var e = new Error(message);
		return e.name = "SuppressedError", e.error = error$1, e.suppressed = suppressed, e;
	};
	tslib_es6_default = {
		__extends,
		__assign,
		__rest,
		__decorate,
		__param,
		__esDecorate,
		__runInitializers,
		__propKey,
		__setFunctionName,
		__metadata,
		__awaiter,
		__generator,
		__createBinding,
		__exportStar,
		__values,
		__read,
		__spread,
		__spreadArrays,
		__spreadArray,
		__await,
		__asyncGenerator,
		__asyncDelegator,
		__asyncValues,
		__makeTemplateObject,
		__importStar,
		__importDefault,
		__classPrivateFieldGet,
		__classPrivateFieldSet,
		__classPrivateFieldIn,
		__addDisposableResource,
		__disposeResources,
		__rewriteRelativeImportExtension
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+uuid@1.1.0/node_modules/@smithy/uuid/dist-cjs/randomUUID.js
var require_randomUUID = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.randomUUID = void 0;
	const crypto_1 = (init_tslib_es6(), require_chunk.__toCommonJS(tslib_es6_exports)).__importDefault(require("crypto"));
	exports.randomUUID = crypto_1.default.randomUUID.bind(crypto_1.default);
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+uuid@1.1.0/node_modules/@smithy/uuid/dist-cjs/index.js
var require_dist_cjs$2 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var randomUUID = require_randomUUID();
	const decimalToHex = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
	const v4 = () => {
		if (randomUUID.randomUUID) return randomUUID.randomUUID();
		const rnds = new Uint8Array(16);
		crypto.getRandomValues(rnds);
		rnds[6] = rnds[6] & 15 | 64;
		rnds[8] = rnds[8] & 63 | 128;
		return decimalToHex[rnds[0]] + decimalToHex[rnds[1]] + decimalToHex[rnds[2]] + decimalToHex[rnds[3]] + "-" + decimalToHex[rnds[4]] + decimalToHex[rnds[5]] + "-" + decimalToHex[rnds[6]] + decimalToHex[rnds[7]] + "-" + decimalToHex[rnds[8]] + decimalToHex[rnds[9]] + "-" + decimalToHex[rnds[10]] + decimalToHex[rnds[11]] + decimalToHex[rnds[12]] + decimalToHex[rnds[13]] + decimalToHex[rnds[14]] + decimalToHex[rnds[15]];
	};
	exports.v4 = v4;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/generateIdempotencyToken.js
var import_dist_cjs$9;
var init_generateIdempotencyToken = require_chunk.__esmMin((() => {
	import_dist_cjs$9 = require_dist_cjs$2();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/lazy-json.js
var LazyJsonString;
var init_lazy_json = require_chunk.__esmMin((() => {
	LazyJsonString = function LazyJsonString$1(val) {
		return Object.assign(new String(val), {
			deserializeJSON() {
				return JSON.parse(String(val));
			},
			toString() {
				return String(val);
			},
			toJSON() {
				return String(val);
			}
		});
	};
	LazyJsonString.from = (object) => {
		if (object && typeof object === "object" && (object instanceof LazyJsonString || "deserializeJSON" in object)) return object;
		else if (typeof object === "string" || Object.getPrototypeOf(object) === String.prototype) return LazyJsonString(String(object));
		return LazyJsonString(JSON.stringify(object));
	};
	LazyJsonString.fromObject = LazyJsonString.from;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/quote-header.js
function quoteHeader(part) {
	if (part.includes(",") || part.includes("\"")) part = `"${part.replace(/"/g, "\\\"")}"`;
	return part;
}
var init_quote_header = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/schema-serde-lib/schema-date-utils.js
function range(v, min, max) {
	const _v = Number(v);
	if (_v < min || _v > max) throw new Error(`Value ${_v} out of range [${min}, ${max}]`);
}
var ddd, mmm, time, date, year, RFC3339_WITH_OFFSET, IMF_FIXDATE, RFC_850_DATE, ASC_TIME, months, _parseEpochTimestamp, _parseRfc3339DateTimeWithOffset, _parseRfc7231DateTime;
var init_schema_date_utils = require_chunk.__esmMin((() => {
	ddd = `(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?`;
	mmm = `(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)`;
	time = `(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?`;
	date = `(\\d?\\d)`;
	year = `(\\d{4})`;
	RFC3339_WITH_OFFSET = /* @__PURE__ */ new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/);
	IMF_FIXDATE = /* @__PURE__ */ new RegExp(`^${ddd}, ${date} ${mmm} ${year} ${time} GMT$`);
	RFC_850_DATE = /* @__PURE__ */ new RegExp(`^${ddd}, ${date}-${mmm}-(\\d\\d) ${time} GMT$`);
	ASC_TIME = /* @__PURE__ */ new RegExp(`^${ddd} ${mmm} ( [1-9]|\\d\\d) ${time} ${year}$`);
	months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	_parseEpochTimestamp = (value) => {
		if (value == null) return;
		let num = NaN;
		if (typeof value === "number") num = value;
		else if (typeof value === "string") {
			if (!/^-?\d*\.?\d+$/.test(value)) throw new TypeError(`parseEpochTimestamp - numeric string invalid.`);
			num = Number.parseFloat(value);
		} else if (typeof value === "object" && value.tag === 1) num = value.value;
		if (isNaN(num) || Math.abs(num) === Infinity) throw new TypeError("Epoch timestamps must be valid finite numbers.");
		return new Date(Math.round(num * 1e3));
	};
	_parseRfc3339DateTimeWithOffset = (value) => {
		if (value == null) return;
		if (typeof value !== "string") throw new TypeError("RFC3339 timestamps must be strings");
		const matches = RFC3339_WITH_OFFSET.exec(value);
		if (!matches) throw new TypeError(`Invalid RFC3339 timestamp format ${value}`);
		const [, yearStr, monthStr, dayStr, hours, minutes, seconds, , ms, offsetStr] = matches;
		range(monthStr, 1, 12);
		range(dayStr, 1, 31);
		range(hours, 0, 23);
		range(minutes, 0, 59);
		range(seconds, 0, 60);
		const date$1 = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr), Number(hours), Number(minutes), Number(seconds), Number(ms) ? Math.round(parseFloat(`0.${ms}`) * 1e3) : 0));
		date$1.setUTCFullYear(Number(yearStr));
		if (offsetStr.toUpperCase() != "Z") {
			const [, sign, offsetH, offsetM] = /([+-])(\d\d):(\d\d)/.exec(offsetStr) || [
				void 0,
				"+",
				0,
				0
			];
			const scalar = sign === "-" ? 1 : -1;
			date$1.setTime(date$1.getTime() + scalar * (Number(offsetH) * 60 * 60 * 1e3 + Number(offsetM) * 60 * 1e3));
		}
		return date$1;
	};
	_parseRfc7231DateTime = (value) => {
		if (value == null) return;
		if (typeof value !== "string") throw new TypeError("RFC7231 timestamps must be strings.");
		let day;
		let month;
		let year$1;
		let hour;
		let minute;
		let second;
		let fraction;
		let matches;
		if (matches = IMF_FIXDATE.exec(value)) [, day, month, year$1, hour, minute, second, fraction] = matches;
		else if (matches = RFC_850_DATE.exec(value)) {
			[, day, month, year$1, hour, minute, second, fraction] = matches;
			year$1 = (Number(year$1) + 1900).toString();
		} else if (matches = ASC_TIME.exec(value)) [, month, day, hour, minute, second, fraction, year$1] = matches;
		if (year$1 && second) {
			const timestamp = Date.UTC(Number(year$1), months.indexOf(month), Number(day), Number(hour), Number(minute), Number(second), fraction ? Math.round(parseFloat(`0.${fraction}`) * 1e3) : 0);
			range(day, 1, 31);
			range(hour, 0, 23);
			range(minute, 0, 59);
			range(second, 0, 60);
			const date$1 = new Date(timestamp);
			date$1.setUTCFullYear(Number(year$1));
			return date$1;
		}
		throw new TypeError(`Invalid RFC7231 date-time value ${value}.`);
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/split-every.js
function splitEvery(value, delimiter, numDelimiters) {
	if (numDelimiters <= 0 || !Number.isInteger(numDelimiters)) throw new Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
	const segments = value.split(delimiter);
	if (numDelimiters === 1) return segments;
	const compoundSegments = [];
	let currentSegment = "";
	for (let i = 0; i < segments.length; i++) {
		if (currentSegment === "") currentSegment = segments[i];
		else currentSegment += delimiter + segments[i];
		if ((i + 1) % numDelimiters === 0) {
			compoundSegments.push(currentSegment);
			currentSegment = "";
		}
	}
	if (currentSegment !== "") compoundSegments.push(currentSegment);
	return compoundSegments;
}
var init_split_every = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/split-header.js
var splitHeader;
var init_split_header = require_chunk.__esmMin((() => {
	splitHeader = (value) => {
		const z = value.length;
		const values = [];
		let withinQuotes = false;
		let prevChar = void 0;
		let anchor = 0;
		for (let i = 0; i < z; ++i) {
			const char = value[i];
			switch (char) {
				case `"`:
					if (prevChar !== "\\") withinQuotes = !withinQuotes;
					break;
				case ",":
					if (!withinQuotes) {
						values.push(value.slice(anchor, i));
						anchor = i + 1;
					}
					break;
				default:
			}
			prevChar = char;
		}
		values.push(value.slice(anchor));
		return values.map((v) => {
			v = v.trim();
			const z$1 = v.length;
			if (z$1 < 2) return v;
			if (v[0] === `"` && v[z$1 - 1] === `"`) v = v.slice(1, z$1 - 1);
			return v.replace(/\\"/g, "\"");
		});
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/value/NumericValue.js
function nv(input) {
	return new NumericValue(String(input), "bigDecimal");
}
var format, NumericValue;
var init_NumericValue = require_chunk.__esmMin((() => {
	format = /^-?\d*(\.\d+)?$/;
	NumericValue = class NumericValue {
		string;
		type;
		constructor(string, type) {
			this.string = string;
			this.type = type;
			if (!format.test(string)) throw new Error(`@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".`);
		}
		toString() {
			return this.string;
		}
		static [Symbol.hasInstance](object) {
			if (!object || typeof object !== "object") return false;
			const _nv = object;
			return NumericValue.prototype.isPrototypeOf(object) || _nv.type === "bigDecimal" && format.test(_nv.string);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/serde/index.js
var serde_exports = /* @__PURE__ */ require_chunk.__exportAll({
	LazyJsonString: () => LazyJsonString,
	NumericValue: () => NumericValue,
	_parseEpochTimestamp: () => _parseEpochTimestamp,
	_parseRfc3339DateTimeWithOffset: () => _parseRfc3339DateTimeWithOffset,
	_parseRfc7231DateTime: () => _parseRfc7231DateTime,
	copyDocumentWithTransform: () => copyDocumentWithTransform,
	dateToUtcString: () => dateToUtcString,
	expectBoolean: () => expectBoolean,
	expectByte: () => expectByte,
	expectFloat32: () => expectFloat32,
	expectInt: () => expectInt,
	expectInt32: () => expectInt32,
	expectLong: () => expectLong,
	expectNonNull: () => expectNonNull,
	expectNumber: () => expectNumber,
	expectObject: () => expectObject,
	expectShort: () => expectShort,
	expectString: () => expectString,
	expectUnion: () => expectUnion,
	generateIdempotencyToken: () => import_dist_cjs$9.v4,
	handleFloat: () => handleFloat,
	limitedParseDouble: () => limitedParseDouble,
	limitedParseFloat: () => limitedParseFloat,
	limitedParseFloat32: () => limitedParseFloat32,
	logger: () => logger,
	nv: () => nv,
	parseBoolean: () => parseBoolean,
	parseEpochTimestamp: () => parseEpochTimestamp,
	parseRfc3339DateTime: () => parseRfc3339DateTime,
	parseRfc3339DateTimeWithOffset: () => parseRfc3339DateTimeWithOffset,
	parseRfc7231DateTime: () => parseRfc7231DateTime,
	quoteHeader: () => quoteHeader,
	splitEvery: () => splitEvery,
	splitHeader: () => splitHeader,
	strictParseByte: () => strictParseByte,
	strictParseDouble: () => strictParseDouble,
	strictParseFloat: () => strictParseFloat,
	strictParseFloat32: () => strictParseFloat32,
	strictParseInt: () => strictParseInt,
	strictParseInt32: () => strictParseInt32,
	strictParseLong: () => strictParseLong,
	strictParseShort: () => strictParseShort
});
var init_serde = require_chunk.__esmMin((() => {
	init_copyDocumentWithTransform();
	init_date_utils();
	init_generateIdempotencyToken();
	init_lazy_json();
	init_parse_utils();
	init_quote_header();
	init_schema_date_utils();
	init_split_every();
	init_split_header();
	init_NumericValue();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/SerdeContext.js
var SerdeContext;
var init_SerdeContext = require_chunk.__esmMin((() => {
	SerdeContext = class {
		serdeContext;
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/HttpProtocol.js
var import_dist_cjs$8, HttpProtocol;
var init_HttpProtocol = require_chunk.__esmMin((() => {
	init_schema();
	import_dist_cjs$8 = require_dist_cjs$16.require_dist_cjs();
	init_SerdeContext();
	HttpProtocol = class extends SerdeContext {
		options;
		constructor(options) {
			super();
			this.options = options;
		}
		getRequestType() {
			return import_dist_cjs$8.HttpRequest;
		}
		getResponseType() {
			return import_dist_cjs$8.HttpResponse;
		}
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
			this.serializer.setSerdeContext(serdeContext);
			this.deserializer.setSerdeContext(serdeContext);
			if (this.getPayloadCodec()) this.getPayloadCodec().setSerdeContext(serdeContext);
		}
		updateServiceEndpoint(request, endpoint) {
			if ("url" in endpoint) {
				request.protocol = endpoint.url.protocol;
				request.hostname = endpoint.url.hostname;
				request.port = endpoint.url.port ? Number(endpoint.url.port) : void 0;
				request.path = endpoint.url.pathname;
				request.fragment = endpoint.url.hash || void 0;
				request.username = endpoint.url.username || void 0;
				request.password = endpoint.url.password || void 0;
				if (!request.query) request.query = {};
				for (const [k, v] of endpoint.url.searchParams.entries()) request.query[k] = v;
				return request;
			} else {
				request.protocol = endpoint.protocol;
				request.hostname = endpoint.hostname;
				request.port = endpoint.port ? Number(endpoint.port) : void 0;
				request.path = endpoint.path;
				request.query = { ...endpoint.query };
				return request;
			}
		}
		setHostPrefix(request, operationSchema, input) {
			const inputNs = NormalizedSchema.of(operationSchema.input);
			const opTraits = translateTraits(operationSchema.traits ?? {});
			if (opTraits.endpoint) {
				let hostPrefix = opTraits.endpoint?.[0];
				if (typeof hostPrefix === "string") {
					const hostLabelInputs = [...inputNs.structIterator()].filter(([, member$1]) => member$1.getMergedTraits().hostLabel);
					for (const [name] of hostLabelInputs) {
						const replacement = input[name];
						if (typeof replacement !== "string") throw new Error(`@smithy/core/schema - ${name} in input must be a string as hostLabel.`);
						hostPrefix = hostPrefix.replace(`{${name}}`, replacement);
					}
					request.hostname = hostPrefix + request.hostname;
				}
			}
		}
		deserializeMetadata(output) {
			return {
				httpStatusCode: output.statusCode,
				requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
				extendedRequestId: output.headers["x-amz-id-2"],
				cfId: output.headers["x-amz-cf-id"]
			};
		}
		async serializeEventStream({ eventStream, requestSchema, initialRequest }) {
			return (await this.loadEventStreamCapability()).serializeEventStream({
				eventStream,
				requestSchema,
				initialRequest
			});
		}
		async deserializeEventStream({ response, responseSchema, initialResponseContainer }) {
			return (await this.loadEventStreamCapability()).deserializeEventStream({
				response,
				responseSchema,
				initialResponseContainer
			});
		}
		async loadEventStreamCapability() {
			const { EventStreamSerde } = await Promise.resolve().then(() => require("./event-streams-DCWKQ_ta.js"));
			return new EventStreamSerde({
				marshaller: this.getEventStreamMarshaller(),
				serializer: this.serializer,
				deserializer: this.deserializer,
				serdeContext: this.serdeContext,
				defaultContentType: this.getDefaultContentType()
			});
		}
		getDefaultContentType() {
			throw new Error(`@smithy/core/protocols - ${this.constructor.name} getDefaultContentType() implementation missing.`);
		}
		async deserializeHttpMessage(schema, context, response, arg4, arg5) {
			return [];
		}
		getEventStreamMarshaller() {
			const context = this.serdeContext;
			if (!context.eventStreamMarshaller) throw new Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
			return context.eventStreamMarshaller;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/HttpBindingProtocol.js
var import_dist_cjs$6, import_dist_cjs$7, HttpBindingProtocol;
var init_HttpBindingProtocol = require_chunk.__esmMin((() => {
	init_schema();
	init_serde();
	import_dist_cjs$6 = require_dist_cjs$16.require_dist_cjs();
	import_dist_cjs$7 = require_dist_cjs$3();
	init_collect_stream_body();
	init_extended_encode_uri_component();
	init_HttpProtocol();
	HttpBindingProtocol = class extends HttpProtocol {
		async serializeRequest(operationSchema, _input, context) {
			const input = { ..._input ?? {} };
			const serializer = this.serializer;
			const query = {};
			const headers = {};
			const endpoint = await context.endpoint();
			const ns = NormalizedSchema.of(operationSchema?.input);
			const schema = ns.getSchema();
			let hasNonHttpBindingMember = false;
			let payload;
			const request = new import_dist_cjs$6.HttpRequest({
				protocol: "",
				hostname: "",
				port: void 0,
				path: "",
				fragment: void 0,
				query,
				headers,
				body: void 0
			});
			if (endpoint) {
				this.updateServiceEndpoint(request, endpoint);
				this.setHostPrefix(request, operationSchema, input);
				const opTraits = translateTraits(operationSchema.traits);
				if (opTraits.http) {
					request.method = opTraits.http[0];
					const [path, search] = opTraits.http[1].split("?");
					if (request.path == "/") request.path = path;
					else request.path += path;
					const traitSearchParams = new URLSearchParams(search ?? "");
					Object.assign(query, Object.fromEntries(traitSearchParams));
				}
			}
			for (const [memberName, memberNs] of ns.structIterator()) {
				const memberTraits = memberNs.getMergedTraits() ?? {};
				const inputMemberValue = input[memberName];
				if (inputMemberValue == null && !memberNs.isIdempotencyToken()) continue;
				if (memberTraits.httpPayload) {
					if (memberNs.isStreaming()) if (memberNs.isStructSchema()) {
						if (input[memberName]) payload = await this.serializeEventStream({
							eventStream: input[memberName],
							requestSchema: ns
						});
					} else payload = inputMemberValue;
					else {
						serializer.write(memberNs, inputMemberValue);
						payload = serializer.flush();
					}
					delete input[memberName];
				} else if (memberTraits.httpLabel) {
					serializer.write(memberNs, inputMemberValue);
					const replacement = serializer.flush();
					if (request.path.includes(`{${memberName}+}`)) request.path = request.path.replace(`{${memberName}+}`, replacement.split("/").map(extendedEncodeURIComponent).join("/"));
					else if (request.path.includes(`{${memberName}}`)) request.path = request.path.replace(`{${memberName}}`, extendedEncodeURIComponent(replacement));
					delete input[memberName];
				} else if (memberTraits.httpHeader) {
					serializer.write(memberNs, inputMemberValue);
					headers[memberTraits.httpHeader.toLowerCase()] = String(serializer.flush());
					delete input[memberName];
				} else if (typeof memberTraits.httpPrefixHeaders === "string") {
					for (const [key, val] of Object.entries(inputMemberValue)) {
						const amalgam = memberTraits.httpPrefixHeaders + key;
						serializer.write([memberNs.getValueSchema(), { httpHeader: amalgam }], val);
						headers[amalgam.toLowerCase()] = serializer.flush();
					}
					delete input[memberName];
				} else if (memberTraits.httpQuery || memberTraits.httpQueryParams) {
					this.serializeQuery(memberNs, inputMemberValue, query);
					delete input[memberName];
				} else hasNonHttpBindingMember = true;
			}
			if (hasNonHttpBindingMember && input) {
				serializer.write(schema, input);
				payload = serializer.flush();
			}
			request.headers = headers;
			request.query = query;
			request.body = payload;
			return request;
		}
		serializeQuery(ns, data, query) {
			const serializer = this.serializer;
			const traits = ns.getMergedTraits();
			if (traits.httpQueryParams) {
				for (const [key, val] of Object.entries(data)) if (!(key in query)) {
					const valueSchema = ns.getValueSchema();
					Object.assign(valueSchema.getMergedTraits(), {
						...traits,
						httpQuery: key,
						httpQueryParams: void 0
					});
					this.serializeQuery(valueSchema, val, query);
				}
				return;
			}
			if (ns.isListSchema()) {
				const sparse = !!ns.getMergedTraits().sparse;
				const buffer = [];
				for (const item of data) {
					serializer.write([ns.getValueSchema(), traits], item);
					const serializable = serializer.flush();
					if (sparse || serializable !== void 0) buffer.push(serializable);
				}
				query[traits.httpQuery] = buffer;
			} else {
				serializer.write([ns, traits], data);
				query[traits.httpQuery] = serializer.flush();
			}
		}
		async deserializeResponse(operationSchema, context, response) {
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(operationSchema.output);
			const dataObject = {};
			if (response.statusCode >= 300) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(15, bytes));
				await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
				throw new Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
			}
			for (const header in response.headers) {
				const value = response.headers[header];
				delete response.headers[header];
				response.headers[header.toLowerCase()] = value;
			}
			const nonHttpBindingMembers = await this.deserializeHttpMessage(ns, context, response, dataObject);
			if (nonHttpBindingMembers.length) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) {
					const dataFromBody = await deserializer.read(ns, bytes);
					for (const member$1 of nonHttpBindingMembers) dataObject[member$1] = dataFromBody[member$1];
				}
			} else if (nonHttpBindingMembers.discardResponseBody) await collectBody(response.body, context);
			dataObject.$metadata = this.deserializeMetadata(response);
			return dataObject;
		}
		async deserializeHttpMessage(schema, context, response, arg4, arg5) {
			let dataObject;
			if (arg4 instanceof Set) dataObject = arg5;
			else dataObject = arg4;
			let discardResponseBody = true;
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(schema);
			const nonHttpBindingMembers = [];
			for (const [memberName, memberSchema] of ns.structIterator()) {
				const memberTraits = memberSchema.getMemberTraits();
				if (memberTraits.httpPayload) {
					discardResponseBody = false;
					if (memberSchema.isStreaming()) if (memberSchema.isStructSchema()) dataObject[memberName] = await this.deserializeEventStream({
						response,
						responseSchema: ns
					});
					else dataObject[memberName] = (0, import_dist_cjs$7.sdkStreamMixin)(response.body);
					else if (response.body) {
						const bytes = await collectBody(response.body, context);
						if (bytes.byteLength > 0) dataObject[memberName] = await deserializer.read(memberSchema, bytes);
					}
				} else if (memberTraits.httpHeader) {
					const key = String(memberTraits.httpHeader).toLowerCase();
					const value = response.headers[key];
					if (null != value) if (memberSchema.isListSchema()) {
						const headerListValueSchema = memberSchema.getValueSchema();
						headerListValueSchema.getMergedTraits().httpHeader = key;
						let sections;
						if (headerListValueSchema.isTimestampSchema() && headerListValueSchema.getSchema() === 4) sections = splitEvery(value, ",", 2);
						else sections = splitHeader(value);
						const list$1 = [];
						for (const section of sections) list$1.push(await deserializer.read(headerListValueSchema, section.trim()));
						dataObject[memberName] = list$1;
					} else dataObject[memberName] = await deserializer.read(memberSchema, value);
				} else if (memberTraits.httpPrefixHeaders !== void 0) {
					dataObject[memberName] = {};
					for (const [header, value] of Object.entries(response.headers)) if (header.startsWith(memberTraits.httpPrefixHeaders)) {
						const valueSchema = memberSchema.getValueSchema();
						valueSchema.getMergedTraits().httpHeader = header;
						dataObject[memberName][header.slice(memberTraits.httpPrefixHeaders.length)] = await deserializer.read(valueSchema, value);
					}
				} else if (memberTraits.httpResponseCode) dataObject[memberName] = response.statusCode;
				else nonHttpBindingMembers.push(memberName);
			}
			nonHttpBindingMembers.discardResponseBody = discardResponseBody;
			return nonHttpBindingMembers;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/RpcProtocol.js
var import_dist_cjs$5, RpcProtocol;
var init_RpcProtocol = require_chunk.__esmMin((() => {
	init_schema();
	import_dist_cjs$5 = require_dist_cjs$16.require_dist_cjs();
	init_collect_stream_body();
	init_HttpProtocol();
	RpcProtocol = class extends HttpProtocol {
		async serializeRequest(operationSchema, input, context) {
			const serializer = this.serializer;
			const query = {};
			const headers = {};
			const endpoint = await context.endpoint();
			const ns = NormalizedSchema.of(operationSchema?.input);
			const schema = ns.getSchema();
			let payload;
			const request = new import_dist_cjs$5.HttpRequest({
				protocol: "",
				hostname: "",
				port: void 0,
				path: "/",
				fragment: void 0,
				query,
				headers,
				body: void 0
			});
			if (endpoint) {
				this.updateServiceEndpoint(request, endpoint);
				this.setHostPrefix(request, operationSchema, input);
			}
			const _input = { ...input };
			if (input) {
				const eventStreamMember = ns.getEventStreamMember();
				if (eventStreamMember) {
					if (_input[eventStreamMember]) {
						const initialRequest = {};
						for (const [memberName, memberSchema] of ns.structIterator()) if (memberName !== eventStreamMember && _input[memberName]) {
							serializer.write(memberSchema, _input[memberName]);
							initialRequest[memberName] = serializer.flush();
						}
						payload = await this.serializeEventStream({
							eventStream: _input[eventStreamMember],
							requestSchema: ns,
							initialRequest
						});
					}
				} else {
					serializer.write(schema, _input);
					payload = serializer.flush();
				}
			}
			request.headers = headers;
			request.query = query;
			request.body = payload;
			request.method = "POST";
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			const deserializer = this.deserializer;
			const ns = NormalizedSchema.of(operationSchema.output);
			const dataObject = {};
			if (response.statusCode >= 300) {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(15, bytes));
				await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
				throw new Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
			}
			for (const header in response.headers) {
				const value = response.headers[header];
				delete response.headers[header];
				response.headers[header.toLowerCase()] = value;
			}
			const eventStreamMember = ns.getEventStreamMember();
			if (eventStreamMember) dataObject[eventStreamMember] = await this.deserializeEventStream({
				response,
				responseSchema: ns,
				initialResponseContainer: dataObject
			});
			else {
				const bytes = await collectBody(response.body, context);
				if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(ns, bytes));
			}
			dataObject.$metadata = this.deserializeMetadata(response);
			return dataObject;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/resolve-path.js
var resolvedPath;
var init_resolve_path = require_chunk.__esmMin((() => {
	init_extended_encode_uri_component();
	resolvedPath = (resolvedPath$1, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
		if (input != null && input[memberName] !== void 0) {
			const labelValue = labelValueProvider();
			if (labelValue.length <= 0) throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
			resolvedPath$1 = resolvedPath$1.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
		} else throw new Error("No value provided for input HTTP label: " + memberName + ".");
		return resolvedPath$1;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/requestBuilder.js
function requestBuilder(input, context) {
	return new RequestBuilder(input, context);
}
var import_dist_cjs$4, RequestBuilder;
var init_requestBuilder = require_chunk.__esmMin((() => {
	import_dist_cjs$4 = require_dist_cjs$16.require_dist_cjs();
	init_resolve_path();
	RequestBuilder = class {
		input;
		context;
		query = {};
		method = "";
		headers = {};
		path = "";
		body = null;
		hostname = "";
		resolvePathStack = [];
		constructor(input, context) {
			this.input = input;
			this.context = context;
		}
		async build() {
			const { hostname, protocol = "https", port, path: basePath } = await this.context.endpoint();
			this.path = basePath;
			for (const resolvePath of this.resolvePathStack) resolvePath(this.path);
			return new import_dist_cjs$4.HttpRequest({
				protocol,
				hostname: this.hostname || hostname,
				port,
				method: this.method,
				path: this.path,
				query: this.query,
				body: this.body,
				headers: this.headers
			});
		}
		hn(hostname) {
			this.hostname = hostname;
			return this;
		}
		bp(uriLabel) {
			this.resolvePathStack.push((basePath) => {
				this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
			});
			return this;
		}
		p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
			this.resolvePathStack.push((path) => {
				this.path = resolvedPath(path, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
			});
			return this;
		}
		h(headers) {
			this.headers = headers;
			return this;
		}
		q(query) {
			this.query = query;
			return this;
		}
		b(body) {
			this.body = body;
			return this;
		}
		m(method) {
			this.method = method;
			return this;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/serde/determineTimestampFormat.js
function determineTimestampFormat(ns, settings) {
	if (settings.timestampFormat.useTrait) {
		if (ns.isTimestampSchema() && (ns.getSchema() === 5 || ns.getSchema() === 6 || ns.getSchema() === 7)) return ns.getSchema();
	}
	const { httpLabel, httpPrefixHeaders, httpHeader, httpQuery } = ns.getMergedTraits();
	return (settings.httpBindings ? typeof httpPrefixHeaders === "string" || Boolean(httpHeader) ? 6 : Boolean(httpQuery) || Boolean(httpLabel) ? 5 : void 0 : void 0) ?? settings.timestampFormat.default;
}
var init_determineTimestampFormat = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/serde/FromStringShapeDeserializer.js
var import_dist_cjs$2, import_dist_cjs$3, FromStringShapeDeserializer;
var init_FromStringShapeDeserializer = require_chunk.__esmMin((() => {
	init_schema();
	init_serde();
	import_dist_cjs$2 = require_dist_cjs$9();
	import_dist_cjs$3 = require_dist_cjs$17.require_dist_cjs();
	init_SerdeContext();
	init_determineTimestampFormat();
	FromStringShapeDeserializer = class extends SerdeContext {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		read(_schema, data) {
			const ns = NormalizedSchema.of(_schema);
			if (ns.isListSchema()) return splitHeader(data).map((item) => this.read(ns.getValueSchema(), item));
			if (ns.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? import_dist_cjs$2.fromBase64)(data);
			if (ns.isTimestampSchema()) switch (determineTimestampFormat(ns, this.settings)) {
				case 5: return _parseRfc3339DateTimeWithOffset(data);
				case 6: return _parseRfc7231DateTime(data);
				case 7: return _parseEpochTimestamp(data);
				default:
					console.warn("Missing timestamp format, parsing value with Date constructor:", data);
					return new Date(data);
			}
			if (ns.isStringSchema()) {
				const mediaType = ns.getMergedTraits().mediaType;
				let intermediateValue = data;
				if (mediaType) {
					if (ns.getMergedTraits().httpHeader) intermediateValue = this.base64ToUtf8(intermediateValue);
					if (mediaType === "application/json" || mediaType.endsWith("+json")) intermediateValue = LazyJsonString.from(intermediateValue);
					return intermediateValue;
				}
			}
			if (ns.isNumericSchema()) return Number(data);
			if (ns.isBigIntegerSchema()) return BigInt(data);
			if (ns.isBigDecimalSchema()) return new NumericValue(data, "bigDecimal");
			if (ns.isBooleanSchema()) return String(data).toLowerCase() === "true";
			return data;
		}
		base64ToUtf8(base64String) {
			return (this.serdeContext?.utf8Encoder ?? import_dist_cjs$3.toUtf8)((this.serdeContext?.base64Decoder ?? import_dist_cjs$2.fromBase64)(base64String));
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/serde/HttpInterceptingShapeDeserializer.js
var import_dist_cjs$1, HttpInterceptingShapeDeserializer;
var init_HttpInterceptingShapeDeserializer = require_chunk.__esmMin((() => {
	init_schema();
	import_dist_cjs$1 = require_dist_cjs$17.require_dist_cjs();
	init_SerdeContext();
	init_FromStringShapeDeserializer();
	HttpInterceptingShapeDeserializer = class extends SerdeContext {
		codecDeserializer;
		stringDeserializer;
		constructor(codecDeserializer, codecSettings) {
			super();
			this.codecDeserializer = codecDeserializer;
			this.stringDeserializer = new FromStringShapeDeserializer(codecSettings);
		}
		setSerdeContext(serdeContext) {
			this.stringDeserializer.setSerdeContext(serdeContext);
			this.codecDeserializer.setSerdeContext(serdeContext);
			this.serdeContext = serdeContext;
		}
		read(schema, data) {
			const ns = NormalizedSchema.of(schema);
			const traits = ns.getMergedTraits();
			const toString = this.serdeContext?.utf8Encoder ?? import_dist_cjs$1.toUtf8;
			if (traits.httpHeader || traits.httpResponseCode) return this.stringDeserializer.read(ns, toString(data));
			if (traits.httpPayload) {
				if (ns.isBlobSchema()) {
					const toBytes = this.serdeContext?.utf8Decoder ?? import_dist_cjs$1.fromUtf8;
					if (typeof data === "string") return toBytes(data);
					return data;
				} else if (ns.isStringSchema()) {
					if ("byteLength" in data) return toString(data);
					return data;
				}
			}
			return this.codecDeserializer.read(ns, data);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/serde/ToStringShapeSerializer.js
var import_dist_cjs, ToStringShapeSerializer;
var init_ToStringShapeSerializer = require_chunk.__esmMin((() => {
	init_schema();
	init_serde();
	import_dist_cjs = require_dist_cjs$9();
	init_SerdeContext();
	init_determineTimestampFormat();
	ToStringShapeSerializer = class extends SerdeContext {
		settings;
		stringBuffer = "";
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value) {
			const ns = NormalizedSchema.of(schema);
			switch (typeof value) {
				case "object":
					if (value === null) {
						this.stringBuffer = "null";
						return;
					}
					if (ns.isTimestampSchema()) {
						if (!(value instanceof Date)) throw new Error(`@smithy/core/protocols - received non-Date value ${value} when schema expected Date in ${ns.getName(true)}`);
						switch (determineTimestampFormat(ns, this.settings)) {
							case 5:
								this.stringBuffer = value.toISOString().replace(".000Z", "Z");
								break;
							case 6:
								this.stringBuffer = dateToUtcString(value);
								break;
							case 7:
								this.stringBuffer = String(value.getTime() / 1e3);
								break;
							default:
								console.warn("Missing timestamp format, using epoch seconds", value);
								this.stringBuffer = String(value.getTime() / 1e3);
						}
						return;
					}
					if (ns.isBlobSchema() && "byteLength" in value) {
						this.stringBuffer = (this.serdeContext?.base64Encoder ?? import_dist_cjs.toBase64)(value);
						return;
					}
					if (ns.isListSchema() && Array.isArray(value)) {
						let buffer = "";
						for (const item of value) {
							this.write([ns.getValueSchema(), ns.getMergedTraits()], item);
							const headerItem = this.flush();
							const serialized = ns.getValueSchema().isTimestampSchema() ? headerItem : quoteHeader(headerItem);
							if (buffer !== "") buffer += ", ";
							buffer += serialized;
						}
						this.stringBuffer = buffer;
						return;
					}
					this.stringBuffer = JSON.stringify(value, null, 2);
					break;
				case "string":
					const mediaType = ns.getMergedTraits().mediaType;
					let intermediateValue = value;
					if (mediaType) {
						if (mediaType === "application/json" || mediaType.endsWith("+json")) intermediateValue = LazyJsonString.from(intermediateValue);
						if (ns.getMergedTraits().httpHeader) {
							this.stringBuffer = (this.serdeContext?.base64Encoder ?? import_dist_cjs.toBase64)(intermediateValue.toString());
							return;
						}
					}
					this.stringBuffer = value;
					break;
				default: if (ns.isIdempotencyToken()) this.stringBuffer = (0, import_dist_cjs$9.v4)();
				else this.stringBuffer = String(value);
			}
		}
		flush() {
			const buffer = this.stringBuffer;
			this.stringBuffer = "";
			return buffer;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/serde/HttpInterceptingShapeSerializer.js
var HttpInterceptingShapeSerializer;
var init_HttpInterceptingShapeSerializer = require_chunk.__esmMin((() => {
	init_schema();
	init_ToStringShapeSerializer();
	HttpInterceptingShapeSerializer = class {
		codecSerializer;
		stringSerializer;
		buffer;
		constructor(codecSerializer, codecSettings, stringSerializer = new ToStringShapeSerializer(codecSettings)) {
			this.codecSerializer = codecSerializer;
			this.stringSerializer = stringSerializer;
		}
		setSerdeContext(serdeContext) {
			this.codecSerializer.setSerdeContext(serdeContext);
			this.stringSerializer.setSerdeContext(serdeContext);
		}
		write(schema, value) {
			const ns = NormalizedSchema.of(schema);
			const traits = ns.getMergedTraits();
			if (traits.httpHeader || traits.httpLabel || traits.httpQuery) {
				this.stringSerializer.write(ns, value);
				this.buffer = this.stringSerializer.flush();
				return;
			}
			return this.codecSerializer.write(ns, value);
		}
		flush() {
			if (this.buffer !== void 0) {
				const buffer = this.buffer;
				this.buffer = void 0;
				return buffer;
			}
			return this.codecSerializer.flush();
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/protocols/index.js
var protocols_exports = /* @__PURE__ */ require_chunk.__exportAll({
	FromStringShapeDeserializer: () => FromStringShapeDeserializer,
	HttpBindingProtocol: () => HttpBindingProtocol,
	HttpInterceptingShapeDeserializer: () => HttpInterceptingShapeDeserializer,
	HttpInterceptingShapeSerializer: () => HttpInterceptingShapeSerializer,
	HttpProtocol: () => HttpProtocol,
	RequestBuilder: () => RequestBuilder,
	RpcProtocol: () => RpcProtocol,
	SerdeContext: () => SerdeContext,
	ToStringShapeSerializer: () => ToStringShapeSerializer,
	collectBody: () => collectBody,
	determineTimestampFormat: () => determineTimestampFormat,
	extendedEncodeURIComponent: () => extendedEncodeURIComponent,
	requestBuilder: () => requestBuilder,
	resolvedPath: () => resolvedPath
});
var init_protocols = require_chunk.__esmMin((() => {
	init_collect_stream_body();
	init_extended_encode_uri_component();
	init_HttpBindingProtocol();
	init_HttpProtocol();
	init_RpcProtocol();
	init_requestBuilder();
	init_resolve_path();
	init_FromStringShapeDeserializer();
	init_HttpInterceptingShapeDeserializer();
	init_HttpInterceptingShapeSerializer();
	init_ToStringShapeSerializer();
	init_determineTimestampFormat();
	init_SerdeContext();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-stack@4.2.5/node_modules/@smithy/middleware-stack/dist-cjs/index.js
var require_dist_cjs$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	const getAllAliases = (name, aliases) => {
		const _aliases = [];
		if (name) _aliases.push(name);
		if (aliases) for (const alias of aliases) _aliases.push(alias);
		return _aliases;
	};
	const getMiddlewareNameWithAliases = (name, aliases) => {
		return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
	};
	const constructStack = () => {
		let absoluteEntries = [];
		let relativeEntries = [];
		let identifyOnResolve = false;
		const entriesNameSet = /* @__PURE__ */ new Set();
		const sort = (entries) => entries.sort((a, b) => stepWeights[b.step] - stepWeights[a.step] || priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"]);
		const removeByName = (toRemove) => {
			let isRemoved = false;
			const filterCb = (entry) => {
				const aliases = getAllAliases(entry.name, entry.aliases);
				if (aliases.includes(toRemove)) {
					isRemoved = true;
					for (const alias of aliases) entriesNameSet.delete(alias);
					return false;
				}
				return true;
			};
			absoluteEntries = absoluteEntries.filter(filterCb);
			relativeEntries = relativeEntries.filter(filterCb);
			return isRemoved;
		};
		const removeByReference = (toRemove) => {
			let isRemoved = false;
			const filterCb = (entry) => {
				if (entry.middleware === toRemove) {
					isRemoved = true;
					for (const alias of getAllAliases(entry.name, entry.aliases)) entriesNameSet.delete(alias);
					return false;
				}
				return true;
			};
			absoluteEntries = absoluteEntries.filter(filterCb);
			relativeEntries = relativeEntries.filter(filterCb);
			return isRemoved;
		};
		const cloneTo = (toStack) => {
			absoluteEntries.forEach((entry) => {
				toStack.add(entry.middleware, { ...entry });
			});
			relativeEntries.forEach((entry) => {
				toStack.addRelativeTo(entry.middleware, { ...entry });
			});
			toStack.identifyOnResolve?.(stack.identifyOnResolve());
			return toStack;
		};
		const expandRelativeMiddlewareList = (from) => {
			const expandedMiddlewareList = [];
			from.before.forEach((entry) => {
				if (entry.before.length === 0 && entry.after.length === 0) expandedMiddlewareList.push(entry);
				else expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
			});
			expandedMiddlewareList.push(from);
			from.after.reverse().forEach((entry) => {
				if (entry.before.length === 0 && entry.after.length === 0) expandedMiddlewareList.push(entry);
				else expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
			});
			return expandedMiddlewareList;
		};
		const getMiddlewareList = (debug = false) => {
			const normalizedAbsoluteEntries = [];
			const normalizedRelativeEntries = [];
			const normalizedEntriesNameMap = {};
			absoluteEntries.forEach((entry) => {
				const normalizedEntry = {
					...entry,
					before: [],
					after: []
				};
				for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) normalizedEntriesNameMap[alias] = normalizedEntry;
				normalizedAbsoluteEntries.push(normalizedEntry);
			});
			relativeEntries.forEach((entry) => {
				const normalizedEntry = {
					...entry,
					before: [],
					after: []
				};
				for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) normalizedEntriesNameMap[alias] = normalizedEntry;
				normalizedRelativeEntries.push(normalizedEntry);
			});
			normalizedRelativeEntries.forEach((entry) => {
				if (entry.toMiddleware) {
					const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
					if (toMiddleware === void 0) {
						if (debug) return;
						throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
					}
					if (entry.relation === "after") toMiddleware.after.push(entry);
					if (entry.relation === "before") toMiddleware.before.push(entry);
				}
			});
			return sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
				wholeList.push(...expandedMiddlewareList);
				return wholeList;
			}, []);
		};
		const stack = {
			add: (middleware, options = {}) => {
				const { name, override, aliases: _aliases } = options;
				const entry = {
					step: "initialize",
					priority: "normal",
					middleware,
					...options
				};
				const aliases = getAllAliases(name, _aliases);
				if (aliases.length > 0) {
					if (aliases.some((alias) => entriesNameSet.has(alias))) {
						if (!override) throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
						for (const alias of aliases) {
							const toOverrideIndex = absoluteEntries.findIndex((entry$1) => entry$1.name === alias || entry$1.aliases?.some((a) => a === alias));
							if (toOverrideIndex === -1) continue;
							const toOverride = absoluteEntries[toOverrideIndex];
							if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
							absoluteEntries.splice(toOverrideIndex, 1);
						}
					}
					for (const alias of aliases) entriesNameSet.add(alias);
				}
				absoluteEntries.push(entry);
			},
			addRelativeTo: (middleware, options) => {
				const { name, override, aliases: _aliases } = options;
				const entry = {
					middleware,
					...options
				};
				const aliases = getAllAliases(name, _aliases);
				if (aliases.length > 0) {
					if (aliases.some((alias) => entriesNameSet.has(alias))) {
						if (!override) throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
						for (const alias of aliases) {
							const toOverrideIndex = relativeEntries.findIndex((entry$1) => entry$1.name === alias || entry$1.aliases?.some((a) => a === alias));
							if (toOverrideIndex === -1) continue;
							const toOverride = relativeEntries[toOverrideIndex];
							if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
							relativeEntries.splice(toOverrideIndex, 1);
						}
					}
					for (const alias of aliases) entriesNameSet.add(alias);
				}
				relativeEntries.push(entry);
			},
			clone: () => cloneTo(constructStack()),
			use: (plugin) => {
				plugin.applyToStack(stack);
			},
			remove: (toRemove) => {
				if (typeof toRemove === "string") return removeByName(toRemove);
				else return removeByReference(toRemove);
			},
			removeByTag: (toRemove) => {
				let isRemoved = false;
				const filterCb = (entry) => {
					const { tags, name, aliases: _aliases } = entry;
					if (tags && tags.includes(toRemove)) {
						const aliases = getAllAliases(name, _aliases);
						for (const alias of aliases) entriesNameSet.delete(alias);
						isRemoved = true;
						return false;
					}
					return true;
				};
				absoluteEntries = absoluteEntries.filter(filterCb);
				relativeEntries = relativeEntries.filter(filterCb);
				return isRemoved;
			},
			concat: (from) => {
				const cloned = cloneTo(constructStack());
				cloned.use(from);
				cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
				return cloned;
			},
			applyToStack: cloneTo,
			identify: () => {
				return getMiddlewareList(true).map((mw) => {
					const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
					return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
				});
			},
			identifyOnResolve(toggle) {
				if (typeof toggle === "boolean") identifyOnResolve = toggle;
				return identifyOnResolve;
			},
			resolve: (handler, context) => {
				for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) handler = middleware(handler, context);
				if (identifyOnResolve) console.log(stack.identify());
				return handler;
			}
		};
		return stack;
	};
	const stepWeights = {
		initialize: 5,
		serialize: 4,
		build: 3,
		finalizeRequest: 2,
		deserialize: 1
	};
	const priorityWeights = {
		high: 3,
		normal: 2,
		low: 1
	};
	exports.constructStack = constructStack;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+smithy-client@4.9.8/node_modules/@smithy/smithy-client/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var middlewareStack = require_dist_cjs$1();
	var protocols = (init_protocols(), require_chunk.__toCommonJS(protocols_exports));
	var types = require_dist_cjs$15.require_dist_cjs();
	var schema = (init_schema(), require_chunk.__toCommonJS(schema_exports));
	var serde = (init_serde(), require_chunk.__toCommonJS(serde_exports));
	var Client = class {
		config;
		middlewareStack = middlewareStack.constructStack();
		initConfig;
		handlers;
		constructor(config) {
			this.config = config;
		}
		send(command, optionsOrCb, cb) {
			const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
			const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
			const useHandlerCache = options === void 0 && this.config.cacheMiddleware === true;
			let handler;
			if (useHandlerCache) {
				if (!this.handlers) this.handlers = /* @__PURE__ */ new WeakMap();
				const handlers = this.handlers;
				if (handlers.has(command.constructor)) handler = handlers.get(command.constructor);
				else {
					handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
					handlers.set(command.constructor, handler);
				}
			} else {
				delete this.handlers;
				handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
			}
			if (callback) handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {});
			else return handler(command).then((result) => result.output);
		}
		destroy() {
			this.config?.requestHandler?.destroy?.();
			delete this.handlers;
		}
	};
	const SENSITIVE_STRING$1 = "***SensitiveInformation***";
	function schemaLogFilter(schema$1, data) {
		if (data == null) return data;
		const ns = schema.NormalizedSchema.of(schema$1);
		if (ns.getMergedTraits().sensitive) return SENSITIVE_STRING$1;
		if (ns.isListSchema()) {
			if (!!ns.getValueSchema().getMergedTraits().sensitive) return SENSITIVE_STRING$1;
		} else if (ns.isMapSchema()) {
			if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive) return SENSITIVE_STRING$1;
		} else if (ns.isStructSchema() && typeof data === "object") {
			const object = data;
			const newObject = {};
			for (const [member$1, memberNs] of ns.structIterator()) if (object[member$1] != null) newObject[member$1] = schemaLogFilter(memberNs, object[member$1]);
			return newObject;
		}
		return data;
	}
	var Command = class {
		middlewareStack = middlewareStack.constructStack();
		schema;
		static classBuilder() {
			return new ClassBuilder();
		}
		resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
			for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) this.middlewareStack.use(mw);
			const stack = clientStack.concat(this.middlewareStack);
			const { logger: logger$1 } = configuration;
			const handlerExecutionContext = {
				logger: logger$1,
				clientName,
				commandName,
				inputFilterSensitiveLog,
				outputFilterSensitiveLog,
				[types.SMITHY_CONTEXT_KEY]: {
					commandInstance: this,
					...smithyContext
				},
				...additionalContext
			};
			const { requestHandler } = configuration;
			return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
		}
	};
	var ClassBuilder = class {
		_init = () => {};
		_ep = {};
		_middlewareFn = () => [];
		_commandName = "";
		_clientName = "";
		_additionalContext = {};
		_smithyContext = {};
		_inputFilterSensitiveLog = void 0;
		_outputFilterSensitiveLog = void 0;
		_serializer = null;
		_deserializer = null;
		_operationSchema;
		init(cb) {
			this._init = cb;
		}
		ep(endpointParameterInstructions) {
			this._ep = endpointParameterInstructions;
			return this;
		}
		m(middlewareSupplier) {
			this._middlewareFn = middlewareSupplier;
			return this;
		}
		s(service, operation$1, smithyContext = {}) {
			this._smithyContext = {
				service,
				operation: operation$1,
				...smithyContext
			};
			return this;
		}
		c(additionalContext = {}) {
			this._additionalContext = additionalContext;
			return this;
		}
		n(clientName, commandName) {
			this._clientName = clientName;
			this._commandName = commandName;
			return this;
		}
		f(inputFilter = (_) => _, outputFilter = (_) => _) {
			this._inputFilterSensitiveLog = inputFilter;
			this._outputFilterSensitiveLog = outputFilter;
			return this;
		}
		ser(serializer) {
			this._serializer = serializer;
			return this;
		}
		de(deserializer) {
			this._deserializer = deserializer;
			return this;
		}
		sc(operation$1) {
			this._operationSchema = operation$1;
			this._smithyContext.operationSchema = operation$1;
			return this;
		}
		build() {
			const closure = this;
			let CommandRef;
			return CommandRef = class extends Command {
				input;
				static getEndpointParameterInstructions() {
					return closure._ep;
				}
				constructor(...[input]) {
					super();
					this.input = input ?? {};
					closure._init(this);
					this.schema = closure._operationSchema;
				}
				resolveMiddleware(stack, configuration, options) {
					const op$1 = closure._operationSchema;
					const input = op$1?.[4] ?? op$1?.input;
					const output = op$1?.[5] ?? op$1?.output;
					return this.resolveMiddlewareWithContext(stack, configuration, options, {
						CommandCtor: CommandRef,
						middlewareFn: closure._middlewareFn,
						clientName: closure._clientName,
						commandName: closure._commandName,
						inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op$1 ? schemaLogFilter.bind(null, input) : (_) => _),
						outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op$1 ? schemaLogFilter.bind(null, output) : (_) => _),
						smithyContext: closure._smithyContext,
						additionalContext: closure._additionalContext
					});
				}
				serialize = closure._serializer;
				deserialize = closure._deserializer;
			};
		}
	};
	const SENSITIVE_STRING = "***SensitiveInformation***";
	const createAggregatedClient = (commands, Client) => {
		for (const command of Object.keys(commands)) {
			const CommandCtor = commands[command];
			const methodImpl = async function(args, optionsOrCb, cb) {
				const command$1 = new CommandCtor(args);
				if (typeof optionsOrCb === "function") this.send(command$1, optionsOrCb);
				else if (typeof cb === "function") {
					if (typeof optionsOrCb !== "object") throw new Error(`Expected http options but got ${typeof optionsOrCb}`);
					this.send(command$1, optionsOrCb || {}, cb);
				} else return this.send(command$1, optionsOrCb);
			};
			const methodName = (command[0].toLowerCase() + command.slice(1)).replace(/Command$/, "");
			Client.prototype[methodName] = methodImpl;
		}
	};
	var ServiceException = class ServiceException extends Error {
		$fault;
		$response;
		$retryable;
		$metadata;
		constructor(options) {
			super(options.message);
			Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
			this.name = options.name;
			this.$fault = options.$fault;
			this.$metadata = options.$metadata;
		}
		static isInstance(value) {
			if (!value) return false;
			const candidate = value;
			return ServiceException.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
		}
		static [Symbol.hasInstance](instance) {
			if (!instance) return false;
			const candidate = instance;
			if (this === ServiceException) return ServiceException.isInstance(instance);
			if (ServiceException.isInstance(instance)) {
				if (candidate.name && this.name) return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
				return this.prototype.isPrototypeOf(instance);
			}
			return false;
		}
	};
	const decorateServiceException = (exception, additions = {}) => {
		Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k, v]) => {
			if (exception[k] == void 0 || exception[k] === "") exception[k] = v;
		});
		exception.message = exception.message || exception.Message || "UnknownError";
		delete exception.Message;
		return exception;
	};
	const throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
		const $metadata = deserializeMetadata(output);
		const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
		throw decorateServiceException(new exceptionCtor({
			name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
			$fault: "client",
			$metadata
		}), parsedBody);
	};
	const withBaseException = (ExceptionCtor) => {
		return ({ output, parsedBody, errorCode }) => {
			throwDefaultError({
				output,
				parsedBody,
				exceptionCtor: ExceptionCtor,
				errorCode
			});
		};
	};
	const deserializeMetadata = (output) => ({
		httpStatusCode: output.statusCode,
		requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
		extendedRequestId: output.headers["x-amz-id-2"],
		cfId: output.headers["x-amz-cf-id"]
	});
	const loadConfigsForDefaultMode = (mode) => {
		switch (mode) {
			case "standard": return {
				retryMode: "standard",
				connectionTimeout: 3100
			};
			case "in-region": return {
				retryMode: "standard",
				connectionTimeout: 1100
			};
			case "cross-region": return {
				retryMode: "standard",
				connectionTimeout: 3100
			};
			case "mobile": return {
				retryMode: "standard",
				connectionTimeout: 3e4
			};
			default: return {};
		}
	};
	let warningEmitted = false;
	const emitWarningIfUnsupportedVersion = (version) => {
		if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 16) warningEmitted = true;
	};
	const getChecksumConfiguration = (runtimeConfig) => {
		const checksumAlgorithms = [];
		for (const id in types.AlgorithmId) {
			const algorithmId = types.AlgorithmId[id];
			if (runtimeConfig[algorithmId] === void 0) continue;
			checksumAlgorithms.push({
				algorithmId: () => algorithmId,
				checksumConstructor: () => runtimeConfig[algorithmId]
			});
		}
		return {
			addChecksumAlgorithm(algo) {
				checksumAlgorithms.push(algo);
			},
			checksumAlgorithms() {
				return checksumAlgorithms;
			}
		};
	};
	const resolveChecksumRuntimeConfig = (clientConfig) => {
		const runtimeConfig = {};
		clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
			runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
		});
		return runtimeConfig;
	};
	const getRetryConfiguration = (runtimeConfig) => {
		return {
			setRetryStrategy(retryStrategy) {
				runtimeConfig.retryStrategy = retryStrategy;
			},
			retryStrategy() {
				return runtimeConfig.retryStrategy;
			}
		};
	};
	const resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
		const runtimeConfig = {};
		runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
		return runtimeConfig;
	};
	const getDefaultExtensionConfiguration = (runtimeConfig) => {
		return Object.assign(getChecksumConfiguration(runtimeConfig), getRetryConfiguration(runtimeConfig));
	};
	const getDefaultClientConfiguration = getDefaultExtensionConfiguration;
	const resolveDefaultRuntimeConfig = (config) => {
		return Object.assign(resolveChecksumRuntimeConfig(config), resolveRetryRuntimeConfig(config));
	};
	const getArrayIfSingleItem = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];
	const getValueFromTextNode = (obj) => {
		const textNodeName = "#text";
		for (const key in obj) if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) obj[key] = obj[key][textNodeName];
		else if (typeof obj[key] === "object" && obj[key] !== null) obj[key] = getValueFromTextNode(obj[key]);
		return obj;
	};
	const isSerializableHeaderValue = (value) => {
		return value != null;
	};
	var NoOpLogger = class {
		trace() {}
		debug() {}
		info() {}
		warn() {}
		error() {}
	};
	function map(arg0, arg1, arg2) {
		let target;
		let filter;
		let instructions;
		if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
			target = {};
			instructions = arg0;
		} else {
			target = arg0;
			if (typeof arg1 === "function") {
				filter = arg1;
				instructions = arg2;
				return mapWithFilter(target, filter, instructions);
			} else instructions = arg1;
		}
		for (const key of Object.keys(instructions)) {
			if (!Array.isArray(instructions[key])) {
				target[key] = instructions[key];
				continue;
			}
			applyInstruction(target, null, instructions, key);
		}
		return target;
	}
	const convertMap = (target) => {
		const output = {};
		for (const [k, v] of Object.entries(target || {})) output[k] = [, v];
		return output;
	};
	const take = (source, instructions) => {
		const out = {};
		for (const key in instructions) applyInstruction(out, source, instructions, key);
		return out;
	};
	const mapWithFilter = (target, filter, instructions) => {
		return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
			if (Array.isArray(value)) _instructions[key] = value;
			else if (typeof value === "function") _instructions[key] = [filter, value()];
			else _instructions[key] = [filter, value];
			return _instructions;
		}, {}));
	};
	const applyInstruction = (target, source, instructions, targetKey) => {
		if (source !== null) {
			let instruction = instructions[targetKey];
			if (typeof instruction === "function") instruction = [, instruction];
			const [filter$1 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
			if (typeof filter$1 === "function" && filter$1(source[sourceKey]) || typeof filter$1 !== "function" && !!filter$1) target[targetKey] = valueFn(source[sourceKey]);
			return;
		}
		let [filter, value] = instructions[targetKey];
		if (typeof value === "function") {
			let _value;
			const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
			const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
			if (defaultFilterPassed) target[targetKey] = _value;
			else if (customFilterPassed) target[targetKey] = value();
		} else {
			const defaultFilterPassed = filter === void 0 && value != null;
			const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
			if (defaultFilterPassed || customFilterPassed) target[targetKey] = value;
		}
	};
	const nonNullish = (_) => _ != null;
	const pass = (_) => _;
	const serializeFloat = (value) => {
		if (value !== value) return "NaN";
		switch (value) {
			case Infinity: return "Infinity";
			case -Infinity: return "-Infinity";
			default: return value;
		}
	};
	const serializeDateTime = (date$1) => date$1.toISOString().replace(".000Z", "Z");
	const _json = (obj) => {
		if (obj == null) return {};
		if (Array.isArray(obj)) return obj.filter((_) => _ != null).map(_json);
		if (typeof obj === "object") {
			const target = {};
			for (const key of Object.keys(obj)) {
				if (obj[key] == null) continue;
				target[key] = _json(obj[key]);
			}
			return target;
		}
		return obj;
	};
	Object.defineProperty(exports, "collectBody", {
		enumerable: true,
		get: function() {
			return protocols.collectBody;
		}
	});
	Object.defineProperty(exports, "extendedEncodeURIComponent", {
		enumerable: true,
		get: function() {
			return protocols.extendedEncodeURIComponent;
		}
	});
	Object.defineProperty(exports, "resolvedPath", {
		enumerable: true,
		get: function() {
			return protocols.resolvedPath;
		}
	});
	exports.Client = Client;
	exports.Command = Command;
	exports.NoOpLogger = NoOpLogger;
	exports.SENSITIVE_STRING = SENSITIVE_STRING;
	exports.ServiceException = ServiceException;
	exports._json = _json;
	exports.convertMap = convertMap;
	exports.createAggregatedClient = createAggregatedClient;
	exports.decorateServiceException = decorateServiceException;
	exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;
	exports.getArrayIfSingleItem = getArrayIfSingleItem;
	exports.getDefaultClientConfiguration = getDefaultClientConfiguration;
	exports.getDefaultExtensionConfiguration = getDefaultExtensionConfiguration;
	exports.getValueFromTextNode = getValueFromTextNode;
	exports.isSerializableHeaderValue = isSerializableHeaderValue;
	exports.loadConfigsForDefaultMode = loadConfigsForDefaultMode;
	exports.map = map;
	exports.resolveDefaultRuntimeConfig = resolveDefaultRuntimeConfig;
	exports.serializeDateTime = serializeDateTime;
	exports.serializeFloat = serializeFloat;
	exports.take = take;
	exports.throwDefaultError = throwDefaultError;
	exports.withBaseException = withBaseException;
	Object.keys(serde).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return serde[k];
			}
		});
	});
}));

//#endregion
Object.defineProperty(exports, 'FromStringShapeDeserializer', {
  enumerable: true,
  get: function () {
    return FromStringShapeDeserializer;
  }
});
Object.defineProperty(exports, 'HttpBindingProtocol', {
  enumerable: true,
  get: function () {
    return HttpBindingProtocol;
  }
});
Object.defineProperty(exports, 'HttpInterceptingShapeDeserializer', {
  enumerable: true,
  get: function () {
    return HttpInterceptingShapeDeserializer;
  }
});
Object.defineProperty(exports, 'HttpInterceptingShapeSerializer', {
  enumerable: true,
  get: function () {
    return HttpInterceptingShapeSerializer;
  }
});
Object.defineProperty(exports, 'LazyJsonString', {
  enumerable: true,
  get: function () {
    return LazyJsonString;
  }
});
Object.defineProperty(exports, 'NormalizedSchema', {
  enumerable: true,
  get: function () {
    return NormalizedSchema;
  }
});
Object.defineProperty(exports, 'NumericValue', {
  enumerable: true,
  get: function () {
    return NumericValue;
  }
});
Object.defineProperty(exports, 'RpcProtocol', {
  enumerable: true,
  get: function () {
    return RpcProtocol;
  }
});
Object.defineProperty(exports, 'SerdeContext', {
  enumerable: true,
  get: function () {
    return SerdeContext;
  }
});
Object.defineProperty(exports, 'TypeRegistry', {
  enumerable: true,
  get: function () {
    return TypeRegistry;
  }
});
Object.defineProperty(exports, '_parseEpochTimestamp', {
  enumerable: true,
  get: function () {
    return _parseEpochTimestamp;
  }
});
Object.defineProperty(exports, 'collectBody', {
  enumerable: true,
  get: function () {
    return collectBody;
  }
});
Object.defineProperty(exports, 'dateToUtcString', {
  enumerable: true,
  get: function () {
    return dateToUtcString;
  }
});
Object.defineProperty(exports, 'deref', {
  enumerable: true,
  get: function () {
    return deref;
  }
});
Object.defineProperty(exports, 'determineTimestampFormat', {
  enumerable: true,
  get: function () {
    return determineTimestampFormat;
  }
});
Object.defineProperty(exports, 'extendedEncodeURIComponent', {
  enumerable: true,
  get: function () {
    return extendedEncodeURIComponent;
  }
});
Object.defineProperty(exports, 'getSchemaSerdePlugin', {
  enumerable: true,
  get: function () {
    return getSchemaSerdePlugin;
  }
});
Object.defineProperty(exports, 'import_dist_cjs', {
  enumerable: true,
  get: function () {
    return import_dist_cjs$9;
  }
});
Object.defineProperty(exports, 'init_protocols', {
  enumerable: true,
  get: function () {
    return init_protocols;
  }
});
Object.defineProperty(exports, 'init_schema', {
  enumerable: true,
  get: function () {
    return init_schema;
  }
});
Object.defineProperty(exports, 'init_serde', {
  enumerable: true,
  get: function () {
    return init_serde;
  }
});
Object.defineProperty(exports, 'init_tslib_es6', {
  enumerable: true,
  get: function () {
    return init_tslib_es6;
  }
});
Object.defineProperty(exports, 'nv', {
  enumerable: true,
  get: function () {
    return nv;
  }
});
Object.defineProperty(exports, 'parseEpochTimestamp', {
  enumerable: true,
  get: function () {
    return parseEpochTimestamp;
  }
});
Object.defineProperty(exports, 'parseRfc3339DateTimeWithOffset', {
  enumerable: true,
  get: function () {
    return parseRfc3339DateTimeWithOffset;
  }
});
Object.defineProperty(exports, 'parseRfc7231DateTime', {
  enumerable: true,
  get: function () {
    return parseRfc7231DateTime;
  }
});
Object.defineProperty(exports, 'requestBuilder', {
  enumerable: true,
  get: function () {
    return requestBuilder;
  }
});
Object.defineProperty(exports, 'require_dist_cjs', {
  enumerable: true,
  get: function () {
    return require_dist_cjs;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$1', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$2;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$2', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$3;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$3', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$4;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$4', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$6;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$5', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$8;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$6', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$9;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$7', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$10;
  }
});
Object.defineProperty(exports, 'schema_exports', {
  enumerable: true,
  get: function () {
    return schema_exports;
  }
});
Object.defineProperty(exports, 'tslib_es6_exports', {
  enumerable: true,
  get: function () {
    return tslib_es6_exports;
  }
});