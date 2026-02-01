const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$5 = require('./dist-cjs-BawS8oYv.js');
const require_client = require('./client-BsEbA1K3.js');
const require_dist_cjs$6 = require('./dist-cjs-CxAZshVx.js');
const require_dist_cjs$7 = require('./dist-cjs-DrUzD-Vw.js');
let node_fs = require("node:fs");

//#region ../node_modules/.pnpm/web-streams-polyfill@3.3.3/node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var require_ponyfill_es2018 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	/**
	* @license
	* web-streams-polyfill v3.3.3
	* Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
	* This code is released under the MIT license.
	* SPDX-License-Identifier: MIT
	*/
	(function(global$1, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global$1 = typeof globalThis !== "undefined" ? globalThis : global$1 || self, factory(global$1.WebStreamsPolyfill = {}));
	})(exports, (function(exports$1) {
		"use strict";
		function noop() {}
		function typeIsObject(x$1) {
			return typeof x$1 === "object" && x$1 !== null || typeof x$1 === "function";
		}
		const rethrowAssertionErrorRejection = noop;
		function setFunctionName(fn, name) {
			try {
				Object.defineProperty(fn, "name", {
					value: name,
					configurable: true
				});
			} catch (_a$1) {}
		}
		const originalPromise = Promise;
		const originalPromiseThen = Promise.prototype.then;
		const originalPromiseReject = Promise.reject.bind(originalPromise);
		function newPromise(executor) {
			return new originalPromise(executor);
		}
		function promiseResolvedWith(value) {
			return newPromise((resolve) => resolve(value));
		}
		function promiseRejectedWith(reason) {
			return originalPromiseReject(reason);
		}
		function PerformPromiseThen(promise, onFulfilled, onRejected) {
			return originalPromiseThen.call(promise, onFulfilled, onRejected);
		}
		function uponPromise(promise, onFulfilled, onRejected) {
			PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
		}
		function uponFulfillment(promise, onFulfilled) {
			uponPromise(promise, onFulfilled);
		}
		function uponRejection(promise, onRejected) {
			uponPromise(promise, void 0, onRejected);
		}
		function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
			return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
		}
		function setPromiseIsHandledToTrue(promise) {
			PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
		}
		let _queueMicrotask = (callback) => {
			if (typeof queueMicrotask === "function") _queueMicrotask = queueMicrotask;
			else {
				const resolvedPromise = promiseResolvedWith(void 0);
				_queueMicrotask = (cb) => PerformPromiseThen(resolvedPromise, cb);
			}
			return _queueMicrotask(callback);
		};
		function reflectCall(F, V, args) {
			if (typeof F !== "function") throw new TypeError("Argument is not a function");
			return Function.prototype.apply.call(F, V, args);
		}
		function promiseCall(F, V, args) {
			try {
				return promiseResolvedWith(reflectCall(F, V, args));
			} catch (value) {
				return promiseRejectedWith(value);
			}
		}
		const QUEUE_MAX_ARRAY_SIZE = 16384;
		/**
		* Simple queue structure.
		*
		* Avoids scalability issues with using a packed array directly by using
		* multiple arrays in a linked list and keeping the array size bounded.
		*/
		class SimpleQueue {
			constructor() {
				this._cursor = 0;
				this._size = 0;
				this._front = {
					_elements: [],
					_next: void 0
				};
				this._back = this._front;
				this._cursor = 0;
				this._size = 0;
			}
			get length() {
				return this._size;
			}
			push(element) {
				const oldBack = this._back;
				let newBack = oldBack;
				if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) newBack = {
					_elements: [],
					_next: void 0
				};
				oldBack._elements.push(element);
				if (newBack !== oldBack) {
					this._back = newBack;
					oldBack._next = newBack;
				}
				++this._size;
			}
			shift() {
				const oldFront = this._front;
				let newFront = oldFront;
				const oldCursor = this._cursor;
				let newCursor = oldCursor + 1;
				const elements = oldFront._elements;
				const element = elements[oldCursor];
				if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
					newFront = oldFront._next;
					newCursor = 0;
				}
				--this._size;
				this._cursor = newCursor;
				if (oldFront !== newFront) this._front = newFront;
				elements[oldCursor] = void 0;
				return element;
			}
			forEach(callback) {
				let i$1 = this._cursor;
				let node = this._front;
				let elements = node._elements;
				while (i$1 !== elements.length || node._next !== void 0) {
					if (i$1 === elements.length) {
						node = node._next;
						elements = node._elements;
						i$1 = 0;
						if (elements.length === 0) break;
					}
					callback(elements[i$1]);
					++i$1;
				}
			}
			peek() {
				const front = this._front;
				const cursor = this._cursor;
				return front._elements[cursor];
			}
		}
		const AbortSteps = Symbol("[[AbortSteps]]");
		const ErrorSteps = Symbol("[[ErrorSteps]]");
		const CancelSteps = Symbol("[[CancelSteps]]");
		const PullSteps = Symbol("[[PullSteps]]");
		const ReleaseSteps = Symbol("[[ReleaseSteps]]");
		function ReadableStreamReaderGenericInitialize(reader, stream) {
			reader._ownerReadableStream = stream;
			stream._reader = reader;
			if (stream._state === "readable") defaultReaderClosedPromiseInitialize(reader);
			else if (stream._state === "closed") defaultReaderClosedPromiseInitializeAsResolved(reader);
			else defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
		}
		function ReadableStreamReaderGenericCancel(reader, reason) {
			const stream = reader._ownerReadableStream;
			return ReadableStreamCancel(stream, reason);
		}
		function ReadableStreamReaderGenericRelease(reader) {
			const stream = reader._ownerReadableStream;
			if (stream._state === "readable") defaultReaderClosedPromiseReject(reader, /* @__PURE__ */ new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
			else defaultReaderClosedPromiseResetToRejected(reader, /* @__PURE__ */ new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
			stream._readableStreamController[ReleaseSteps]();
			stream._reader = void 0;
			reader._ownerReadableStream = void 0;
		}
		function readerLockException(name) {
			return /* @__PURE__ */ new TypeError("Cannot " + name + " a stream using a released reader");
		}
		function defaultReaderClosedPromiseInitialize(reader) {
			reader._closedPromise = newPromise((resolve, reject) => {
				reader._closedPromise_resolve = resolve;
				reader._closedPromise_reject = reject;
			});
		}
		function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
			defaultReaderClosedPromiseInitialize(reader);
			defaultReaderClosedPromiseReject(reader, reason);
		}
		function defaultReaderClosedPromiseInitializeAsResolved(reader) {
			defaultReaderClosedPromiseInitialize(reader);
			defaultReaderClosedPromiseResolve(reader);
		}
		function defaultReaderClosedPromiseReject(reader, reason) {
			if (reader._closedPromise_reject === void 0) return;
			setPromiseIsHandledToTrue(reader._closedPromise);
			reader._closedPromise_reject(reason);
			reader._closedPromise_resolve = void 0;
			reader._closedPromise_reject = void 0;
		}
		function defaultReaderClosedPromiseResetToRejected(reader, reason) {
			defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
		}
		function defaultReaderClosedPromiseResolve(reader) {
			if (reader._closedPromise_resolve === void 0) return;
			reader._closedPromise_resolve(void 0);
			reader._closedPromise_resolve = void 0;
			reader._closedPromise_reject = void 0;
		}
		const NumberIsFinite = Number.isFinite || function(x$1) {
			return typeof x$1 === "number" && isFinite(x$1);
		};
		const MathTrunc = Math.trunc || function(v) {
			return v < 0 ? Math.ceil(v) : Math.floor(v);
		};
		function isDictionary(x$1) {
			return typeof x$1 === "object" || typeof x$1 === "function";
		}
		function assertDictionary(obj, context) {
			if (obj !== void 0 && !isDictionary(obj)) throw new TypeError(`${context} is not an object.`);
		}
		function assertFunction(x$1, context) {
			if (typeof x$1 !== "function") throw new TypeError(`${context} is not a function.`);
		}
		function isObject(x$1) {
			return typeof x$1 === "object" && x$1 !== null || typeof x$1 === "function";
		}
		function assertObject(x$1, context) {
			if (!isObject(x$1)) throw new TypeError(`${context} is not an object.`);
		}
		function assertRequiredArgument(x$1, position, context) {
			if (x$1 === void 0) throw new TypeError(`Parameter ${position} is required in '${context}'.`);
		}
		function assertRequiredField(x$1, field, context) {
			if (x$1 === void 0) throw new TypeError(`${field} is required in '${context}'.`);
		}
		function convertUnrestrictedDouble(value) {
			return Number(value);
		}
		function censorNegativeZero(x$1) {
			return x$1 === 0 ? 0 : x$1;
		}
		function integerPart(x$1) {
			return censorNegativeZero(MathTrunc(x$1));
		}
		function convertUnsignedLongLongWithEnforceRange(value, context) {
			const lowerBound = 0;
			const upperBound = Number.MAX_SAFE_INTEGER;
			let x$1 = Number(value);
			x$1 = censorNegativeZero(x$1);
			if (!NumberIsFinite(x$1)) throw new TypeError(`${context} is not a finite number`);
			x$1 = integerPart(x$1);
			if (x$1 < lowerBound || x$1 > upperBound) throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
			if (!NumberIsFinite(x$1) || x$1 === 0) return 0;
			return x$1;
		}
		function assertReadableStream(x$1, context) {
			if (!IsReadableStream(x$1)) throw new TypeError(`${context} is not a ReadableStream.`);
		}
		function AcquireReadableStreamDefaultReader(stream) {
			return new ReadableStreamDefaultReader(stream);
		}
		function ReadableStreamAddReadRequest(stream, readRequest) {
			stream._reader._readRequests.push(readRequest);
		}
		function ReadableStreamFulfillReadRequest(stream, chunk, done) {
			const readRequest = stream._reader._readRequests.shift();
			if (done) readRequest._closeSteps();
			else readRequest._chunkSteps(chunk);
		}
		function ReadableStreamGetNumReadRequests(stream) {
			return stream._reader._readRequests.length;
		}
		function ReadableStreamHasDefaultReader(stream) {
			const reader = stream._reader;
			if (reader === void 0) return false;
			if (!IsReadableStreamDefaultReader(reader)) return false;
			return true;
		}
		/**
		* A default reader vended by a {@link ReadableStream}.
		*
		* @public
		*/
		class ReadableStreamDefaultReader {
			constructor(stream) {
				assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
				assertReadableStream(stream, "First parameter");
				if (IsReadableStreamLocked(stream)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
				ReadableStreamReaderGenericInitialize(this, stream);
				this._readRequests = new SimpleQueue();
			}
			/**
			* Returns a promise that will be fulfilled when the stream becomes closed,
			* or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
			*/
			get closed() {
				if (!IsReadableStreamDefaultReader(this)) return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
				return this._closedPromise;
			}
			/**
			* If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
			*/
			cancel(reason = void 0) {
				if (!IsReadableStreamDefaultReader(this)) return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
				if (this._ownerReadableStream === void 0) return promiseRejectedWith(readerLockException("cancel"));
				return ReadableStreamReaderGenericCancel(this, reason);
			}
			/**
			* Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
			*
			* If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
			*/
			read() {
				if (!IsReadableStreamDefaultReader(this)) return promiseRejectedWith(defaultReaderBrandCheckException("read"));
				if (this._ownerReadableStream === void 0) return promiseRejectedWith(readerLockException("read from"));
				let resolvePromise;
				let rejectPromise;
				const promise = newPromise((resolve, reject) => {
					resolvePromise = resolve;
					rejectPromise = reject;
				});
				ReadableStreamDefaultReaderRead(this, {
					_chunkSteps: (chunk) => resolvePromise({
						value: chunk,
						done: false
					}),
					_closeSteps: () => resolvePromise({
						value: void 0,
						done: true
					}),
					_errorSteps: (e$1) => rejectPromise(e$1)
				});
				return promise;
			}
			/**
			* Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
			* If the associated stream is errored when the lock is released, the reader will appear errored in the same way
			* from now on; otherwise, the reader will appear closed.
			*
			* A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
			* the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
			* do so will throw a `TypeError` and leave the reader locked to the stream.
			*/
			releaseLock() {
				if (!IsReadableStreamDefaultReader(this)) throw defaultReaderBrandCheckException("releaseLock");
				if (this._ownerReadableStream === void 0) return;
				ReadableStreamDefaultReaderRelease(this);
			}
		}
		Object.defineProperties(ReadableStreamDefaultReader.prototype, {
			cancel: { enumerable: true },
			read: { enumerable: true },
			releaseLock: { enumerable: true },
			closed: { enumerable: true }
		});
		setFunctionName(ReadableStreamDefaultReader.prototype.cancel, "cancel");
		setFunctionName(ReadableStreamDefaultReader.prototype.read, "read");
		setFunctionName(ReadableStreamDefaultReader.prototype.releaseLock, "releaseLock");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ReadableStreamDefaultReader.prototype, Symbol.toStringTag, {
			value: "ReadableStreamDefaultReader",
			configurable: true
		});
		function IsReadableStreamDefaultReader(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_readRequests")) return false;
			return x$1 instanceof ReadableStreamDefaultReader;
		}
		function ReadableStreamDefaultReaderRead(reader, readRequest) {
			const stream = reader._ownerReadableStream;
			stream._disturbed = true;
			if (stream._state === "closed") readRequest._closeSteps();
			else if (stream._state === "errored") readRequest._errorSteps(stream._storedError);
			else stream._readableStreamController[PullSteps](readRequest);
		}
		function ReadableStreamDefaultReaderRelease(reader) {
			ReadableStreamReaderGenericRelease(reader);
			ReadableStreamDefaultReaderErrorReadRequests(reader, /* @__PURE__ */ new TypeError("Reader was released"));
		}
		function ReadableStreamDefaultReaderErrorReadRequests(reader, e$1) {
			const readRequests = reader._readRequests;
			reader._readRequests = new SimpleQueue();
			readRequests.forEach((readRequest) => {
				readRequest._errorSteps(e$1);
			});
		}
		function defaultReaderBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
		}
		const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);
		class ReadableStreamAsyncIteratorImpl {
			constructor(reader, preventCancel) {
				this._ongoingPromise = void 0;
				this._isFinished = false;
				this._reader = reader;
				this._preventCancel = preventCancel;
			}
			next() {
				const nextSteps = () => this._nextSteps();
				this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
				return this._ongoingPromise;
			}
			return(value) {
				const returnSteps = () => this._returnSteps(value);
				return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
			}
			_nextSteps() {
				if (this._isFinished) return Promise.resolve({
					value: void 0,
					done: true
				});
				const reader = this._reader;
				let resolvePromise;
				let rejectPromise;
				const promise = newPromise((resolve, reject) => {
					resolvePromise = resolve;
					rejectPromise = reject;
				});
				ReadableStreamDefaultReaderRead(reader, {
					_chunkSteps: (chunk) => {
						this._ongoingPromise = void 0;
						_queueMicrotask(() => resolvePromise({
							value: chunk,
							done: false
						}));
					},
					_closeSteps: () => {
						this._ongoingPromise = void 0;
						this._isFinished = true;
						ReadableStreamReaderGenericRelease(reader);
						resolvePromise({
							value: void 0,
							done: true
						});
					},
					_errorSteps: (reason) => {
						this._ongoingPromise = void 0;
						this._isFinished = true;
						ReadableStreamReaderGenericRelease(reader);
						rejectPromise(reason);
					}
				});
				return promise;
			}
			_returnSteps(value) {
				if (this._isFinished) return Promise.resolve({
					value,
					done: true
				});
				this._isFinished = true;
				const reader = this._reader;
				if (!this._preventCancel) {
					const result = ReadableStreamReaderGenericCancel(reader, value);
					ReadableStreamReaderGenericRelease(reader);
					return transformPromiseWith(result, () => ({
						value,
						done: true
					}));
				}
				ReadableStreamReaderGenericRelease(reader);
				return promiseResolvedWith({
					value,
					done: true
				});
			}
		}
		const ReadableStreamAsyncIteratorPrototype = {
			next() {
				if (!IsReadableStreamAsyncIterator(this)) return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
				return this._asyncIteratorImpl.next();
			},
			return(value) {
				if (!IsReadableStreamAsyncIterator(this)) return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
				return this._asyncIteratorImpl.return(value);
			}
		};
		Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
		function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
			const impl = new ReadableStreamAsyncIteratorImpl(AcquireReadableStreamDefaultReader(stream), preventCancel);
			const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
			iterator._asyncIteratorImpl = impl;
			return iterator;
		}
		function IsReadableStreamAsyncIterator(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_asyncIteratorImpl")) return false;
			try {
				return x$1._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
			} catch (_a$1) {
				return false;
			}
		}
		function streamAsyncIteratorBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
		}
		const NumberIsNaN = Number.isNaN || function(x$1) {
			return x$1 !== x$1;
		};
		var _a, _b, _c;
		function CreateArrayFromList(elements) {
			return elements.slice();
		}
		function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
			new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
		}
		let TransferArrayBuffer = (O) => {
			if (typeof O.transfer === "function") TransferArrayBuffer = (buffer) => buffer.transfer();
			else if (typeof structuredClone === "function") TransferArrayBuffer = (buffer) => structuredClone(buffer, { transfer: [buffer] });
			else TransferArrayBuffer = (buffer) => buffer;
			return TransferArrayBuffer(O);
		};
		let IsDetachedBuffer = (O) => {
			if (typeof O.detached === "boolean") IsDetachedBuffer = (buffer) => buffer.detached;
			else IsDetachedBuffer = (buffer) => buffer.byteLength === 0;
			return IsDetachedBuffer(O);
		};
		function ArrayBufferSlice(buffer, begin, end) {
			if (buffer.slice) return buffer.slice(begin, end);
			const length = end - begin;
			const slice = new ArrayBuffer(length);
			CopyDataBlockBytes(slice, 0, buffer, begin, length);
			return slice;
		}
		function GetMethod(receiver, prop) {
			const func = receiver[prop];
			if (func === void 0 || func === null) return;
			if (typeof func !== "function") throw new TypeError(`${String(prop)} is not a function`);
			return func;
		}
		function CreateAsyncFromSyncIterator(syncIteratorRecord) {
			const syncIterable = { [Symbol.iterator]: () => syncIteratorRecord.iterator };
			const asyncIterator = async function* () {
				return yield* syncIterable;
			}();
			return {
				iterator: asyncIterator,
				nextMethod: asyncIterator.next,
				done: false
			};
		}
		const SymbolAsyncIterator = (_c = (_a = Symbol.asyncIterator) !== null && _a !== void 0 ? _a : (_b = Symbol.for) === null || _b === void 0 ? void 0 : _b.call(Symbol, "Symbol.asyncIterator")) !== null && _c !== void 0 ? _c : "@@asyncIterator";
		function GetIterator(obj, hint = "sync", method) {
			if (method === void 0) if (hint === "async") {
				method = GetMethod(obj, SymbolAsyncIterator);
				if (method === void 0) return CreateAsyncFromSyncIterator(GetIterator(obj, "sync", GetMethod(obj, Symbol.iterator)));
			} else method = GetMethod(obj, Symbol.iterator);
			if (method === void 0) throw new TypeError("The object is not iterable");
			const iterator = reflectCall(method, obj, []);
			if (!typeIsObject(iterator)) throw new TypeError("The iterator method must return an object");
			return {
				iterator,
				nextMethod: iterator.next,
				done: false
			};
		}
		function IteratorNext(iteratorRecord) {
			const result = reflectCall(iteratorRecord.nextMethod, iteratorRecord.iterator, []);
			if (!typeIsObject(result)) throw new TypeError("The iterator.next() method must return an object");
			return result;
		}
		function IteratorComplete(iterResult) {
			return Boolean(iterResult.done);
		}
		function IteratorValue(iterResult) {
			return iterResult.value;
		}
		function IsNonNegativeNumber(v) {
			if (typeof v !== "number") return false;
			if (NumberIsNaN(v)) return false;
			if (v < 0) return false;
			return true;
		}
		function CloneAsUint8Array(O) {
			const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
			return new Uint8Array(buffer);
		}
		function DequeueValue(container) {
			const pair = container._queue.shift();
			container._queueTotalSize -= pair.size;
			if (container._queueTotalSize < 0) container._queueTotalSize = 0;
			return pair.value;
		}
		function EnqueueValueWithSize(container, value, size) {
			if (!IsNonNegativeNumber(size) || size === Infinity) throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
			container._queue.push({
				value,
				size
			});
			container._queueTotalSize += size;
		}
		function PeekQueueValue(container) {
			return container._queue.peek().value;
		}
		function ResetQueue(container) {
			container._queue = new SimpleQueue();
			container._queueTotalSize = 0;
		}
		function isDataViewConstructor(ctor) {
			return ctor === DataView;
		}
		function isDataView(view) {
			return isDataViewConstructor(view.constructor);
		}
		function arrayBufferViewElementSize(ctor) {
			if (isDataViewConstructor(ctor)) return 1;
			return ctor.BYTES_PER_ELEMENT;
		}
		/**
		* A pull-into request in a {@link ReadableByteStreamController}.
		*
		* @public
		*/
		class ReadableStreamBYOBRequest {
			constructor() {
				throw new TypeError("Illegal constructor");
			}
			/**
			* Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
			*/
			get view() {
				if (!IsReadableStreamBYOBRequest(this)) throw byobRequestBrandCheckException("view");
				return this._view;
			}
			respond(bytesWritten) {
				if (!IsReadableStreamBYOBRequest(this)) throw byobRequestBrandCheckException("respond");
				assertRequiredArgument(bytesWritten, 1, "respond");
				bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
				if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
				if (IsDetachedBuffer(this._view.buffer)) throw new TypeError(`The BYOB request's buffer has been detached and so cannot be used as a response`);
				ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
			}
			respondWithNewView(view) {
				if (!IsReadableStreamBYOBRequest(this)) throw byobRequestBrandCheckException("respondWithNewView");
				assertRequiredArgument(view, 1, "respondWithNewView");
				if (!ArrayBuffer.isView(view)) throw new TypeError("You can only respond with array buffer views");
				if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
				if (IsDetachedBuffer(view.buffer)) throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
				ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
			}
		}
		Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
			respond: { enumerable: true },
			respondWithNewView: { enumerable: true },
			view: { enumerable: true }
		});
		setFunctionName(ReadableStreamBYOBRequest.prototype.respond, "respond");
		setFunctionName(ReadableStreamBYOBRequest.prototype.respondWithNewView, "respondWithNewView");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ReadableStreamBYOBRequest.prototype, Symbol.toStringTag, {
			value: "ReadableStreamBYOBRequest",
			configurable: true
		});
		/**
		* Allows control of a {@link ReadableStream | readable byte stream}'s state and internal queue.
		*
		* @public
		*/
		class ReadableByteStreamController {
			constructor() {
				throw new TypeError("Illegal constructor");
			}
			/**
			* Returns the current BYOB pull request, or `null` if there isn't one.
			*/
			get byobRequest() {
				if (!IsReadableByteStreamController(this)) throw byteStreamControllerBrandCheckException("byobRequest");
				return ReadableByteStreamControllerGetBYOBRequest(this);
			}
			/**
			* Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
			* over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
			*/
			get desiredSize() {
				if (!IsReadableByteStreamController(this)) throw byteStreamControllerBrandCheckException("desiredSize");
				return ReadableByteStreamControllerGetDesiredSize(this);
			}
			/**
			* Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
			* the stream, but once those are read, the stream will become closed.
			*/
			close() {
				if (!IsReadableByteStreamController(this)) throw byteStreamControllerBrandCheckException("close");
				if (this._closeRequested) throw new TypeError("The stream has already been closed; do not close it again!");
				const state = this._controlledReadableByteStream._state;
				if (state !== "readable") throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
				ReadableByteStreamControllerClose(this);
			}
			enqueue(chunk) {
				if (!IsReadableByteStreamController(this)) throw byteStreamControllerBrandCheckException("enqueue");
				assertRequiredArgument(chunk, 1, "enqueue");
				if (!ArrayBuffer.isView(chunk)) throw new TypeError("chunk must be an array buffer view");
				if (chunk.byteLength === 0) throw new TypeError("chunk must have non-zero byteLength");
				if (chunk.buffer.byteLength === 0) throw new TypeError(`chunk's buffer must have non-zero byteLength`);
				if (this._closeRequested) throw new TypeError("stream is closed or draining");
				const state = this._controlledReadableByteStream._state;
				if (state !== "readable") throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
				ReadableByteStreamControllerEnqueue(this, chunk);
			}
			/**
			* Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
			*/
			error(e$1 = void 0) {
				if (!IsReadableByteStreamController(this)) throw byteStreamControllerBrandCheckException("error");
				ReadableByteStreamControllerError(this, e$1);
			}
			/** @internal */
			[CancelSteps](reason) {
				ReadableByteStreamControllerClearPendingPullIntos(this);
				ResetQueue(this);
				const result = this._cancelAlgorithm(reason);
				ReadableByteStreamControllerClearAlgorithms(this);
				return result;
			}
			/** @internal */
			[PullSteps](readRequest) {
				const stream = this._controlledReadableByteStream;
				if (this._queueTotalSize > 0) {
					ReadableByteStreamControllerFillReadRequestFromQueue(this, readRequest);
					return;
				}
				const autoAllocateChunkSize = this._autoAllocateChunkSize;
				if (autoAllocateChunkSize !== void 0) {
					let buffer;
					try {
						buffer = new ArrayBuffer(autoAllocateChunkSize);
					} catch (bufferE) {
						readRequest._errorSteps(bufferE);
						return;
					}
					const pullIntoDescriptor = {
						buffer,
						bufferByteLength: autoAllocateChunkSize,
						byteOffset: 0,
						byteLength: autoAllocateChunkSize,
						bytesFilled: 0,
						minimumFill: 1,
						elementSize: 1,
						viewConstructor: Uint8Array,
						readerType: "default"
					};
					this._pendingPullIntos.push(pullIntoDescriptor);
				}
				ReadableStreamAddReadRequest(stream, readRequest);
				ReadableByteStreamControllerCallPullIfNeeded(this);
			}
			/** @internal */
			[ReleaseSteps]() {
				if (this._pendingPullIntos.length > 0) {
					const firstPullInto = this._pendingPullIntos.peek();
					firstPullInto.readerType = "none";
					this._pendingPullIntos = new SimpleQueue();
					this._pendingPullIntos.push(firstPullInto);
				}
			}
		}
		Object.defineProperties(ReadableByteStreamController.prototype, {
			close: { enumerable: true },
			enqueue: { enumerable: true },
			error: { enumerable: true },
			byobRequest: { enumerable: true },
			desiredSize: { enumerable: true }
		});
		setFunctionName(ReadableByteStreamController.prototype.close, "close");
		setFunctionName(ReadableByteStreamController.prototype.enqueue, "enqueue");
		setFunctionName(ReadableByteStreamController.prototype.error, "error");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ReadableByteStreamController.prototype, Symbol.toStringTag, {
			value: "ReadableByteStreamController",
			configurable: true
		});
		function IsReadableByteStreamController(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_controlledReadableByteStream")) return false;
			return x$1 instanceof ReadableByteStreamController;
		}
		function IsReadableStreamBYOBRequest(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_associatedReadableByteStreamController")) return false;
			return x$1 instanceof ReadableStreamBYOBRequest;
		}
		function ReadableByteStreamControllerCallPullIfNeeded(controller) {
			if (!ReadableByteStreamControllerShouldCallPull(controller)) return;
			if (controller._pulling) {
				controller._pullAgain = true;
				return;
			}
			controller._pulling = true;
			uponPromise(controller._pullAlgorithm(), () => {
				controller._pulling = false;
				if (controller._pullAgain) {
					controller._pullAgain = false;
					ReadableByteStreamControllerCallPullIfNeeded(controller);
				}
				return null;
			}, (e$1) => {
				ReadableByteStreamControllerError(controller, e$1);
				return null;
			});
		}
		function ReadableByteStreamControllerClearPendingPullIntos(controller) {
			ReadableByteStreamControllerInvalidateBYOBRequest(controller);
			controller._pendingPullIntos = new SimpleQueue();
		}
		function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
			let done = false;
			if (stream._state === "closed") done = true;
			const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
			if (pullIntoDescriptor.readerType === "default") ReadableStreamFulfillReadRequest(stream, filledView, done);
			else ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
		}
		function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
			const bytesFilled = pullIntoDescriptor.bytesFilled;
			const elementSize = pullIntoDescriptor.elementSize;
			return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
		}
		function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
			controller._queue.push({
				buffer,
				byteOffset,
				byteLength
			});
			controller._queueTotalSize += byteLength;
		}
		function ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, buffer, byteOffset, byteLength) {
			let clonedChunk;
			try {
				clonedChunk = ArrayBufferSlice(buffer, byteOffset, byteOffset + byteLength);
			} catch (cloneE) {
				ReadableByteStreamControllerError(controller, cloneE);
				throw cloneE;
			}
			ReadableByteStreamControllerEnqueueChunkToQueue(controller, clonedChunk, 0, byteLength);
		}
		function ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstDescriptor) {
			if (firstDescriptor.bytesFilled > 0) ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, firstDescriptor.buffer, firstDescriptor.byteOffset, firstDescriptor.bytesFilled);
			ReadableByteStreamControllerShiftPendingPullInto(controller);
		}
		function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
			const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
			const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
			let totalBytesToCopyRemaining = maxBytesToCopy;
			let ready = false;
			const maxAlignedBytes = maxBytesFilled - maxBytesFilled % pullIntoDescriptor.elementSize;
			if (maxAlignedBytes >= pullIntoDescriptor.minimumFill) {
				totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
				ready = true;
			}
			const queue = controller._queue;
			while (totalBytesToCopyRemaining > 0) {
				const headOfQueue = queue.peek();
				const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
				const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
				CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
				if (headOfQueue.byteLength === bytesToCopy) queue.shift();
				else {
					headOfQueue.byteOffset += bytesToCopy;
					headOfQueue.byteLength -= bytesToCopy;
				}
				controller._queueTotalSize -= bytesToCopy;
				ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
				totalBytesToCopyRemaining -= bytesToCopy;
			}
			return ready;
		}
		function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
			pullIntoDescriptor.bytesFilled += size;
		}
		function ReadableByteStreamControllerHandleQueueDrain(controller) {
			if (controller._queueTotalSize === 0 && controller._closeRequested) {
				ReadableByteStreamControllerClearAlgorithms(controller);
				ReadableStreamClose(controller._controlledReadableByteStream);
			} else ReadableByteStreamControllerCallPullIfNeeded(controller);
		}
		function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
			if (controller._byobRequest === null) return;
			controller._byobRequest._associatedReadableByteStreamController = void 0;
			controller._byobRequest._view = null;
			controller._byobRequest = null;
		}
		function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
			while (controller._pendingPullIntos.length > 0) {
				if (controller._queueTotalSize === 0) return;
				const pullIntoDescriptor = controller._pendingPullIntos.peek();
				if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
					ReadableByteStreamControllerShiftPendingPullInto(controller);
					ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
				}
			}
		}
		function ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller) {
			const reader = controller._controlledReadableByteStream._reader;
			while (reader._readRequests.length > 0) {
				if (controller._queueTotalSize === 0) return;
				ReadableByteStreamControllerFillReadRequestFromQueue(controller, reader._readRequests.shift());
			}
		}
		function ReadableByteStreamControllerPullInto(controller, view, min, readIntoRequest) {
			const stream = controller._controlledReadableByteStream;
			const ctor = view.constructor;
			const elementSize = arrayBufferViewElementSize(ctor);
			const { byteOffset, byteLength } = view;
			const minimumFill = min * elementSize;
			let buffer;
			try {
				buffer = TransferArrayBuffer(view.buffer);
			} catch (e$1) {
				readIntoRequest._errorSteps(e$1);
				return;
			}
			const pullIntoDescriptor = {
				buffer,
				bufferByteLength: buffer.byteLength,
				byteOffset,
				byteLength,
				bytesFilled: 0,
				minimumFill,
				elementSize,
				viewConstructor: ctor,
				readerType: "byob"
			};
			if (controller._pendingPullIntos.length > 0) {
				controller._pendingPullIntos.push(pullIntoDescriptor);
				ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
				return;
			}
			if (stream._state === "closed") {
				const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
				readIntoRequest._closeSteps(emptyView);
				return;
			}
			if (controller._queueTotalSize > 0) {
				if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
					const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
					ReadableByteStreamControllerHandleQueueDrain(controller);
					readIntoRequest._chunkSteps(filledView);
					return;
				}
				if (controller._closeRequested) {
					const e$1 = /* @__PURE__ */ new TypeError("Insufficient bytes to fill elements in the given buffer");
					ReadableByteStreamControllerError(controller, e$1);
					readIntoRequest._errorSteps(e$1);
					return;
				}
			}
			controller._pendingPullIntos.push(pullIntoDescriptor);
			ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
			ReadableByteStreamControllerCallPullIfNeeded(controller);
		}
		function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
			if (firstDescriptor.readerType === "none") ReadableByteStreamControllerShiftPendingPullInto(controller);
			const stream = controller._controlledReadableByteStream;
			if (ReadableStreamHasBYOBReader(stream)) while (ReadableStreamGetNumReadIntoRequests(stream) > 0) ReadableByteStreamControllerCommitPullIntoDescriptor(stream, ReadableByteStreamControllerShiftPendingPullInto(controller));
		}
		function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
			ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
			if (pullIntoDescriptor.readerType === "none") {
				ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, pullIntoDescriptor);
				ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
				return;
			}
			if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.minimumFill) return;
			ReadableByteStreamControllerShiftPendingPullInto(controller);
			const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
			if (remainderSize > 0) {
				const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
				ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, pullIntoDescriptor.buffer, end - remainderSize, remainderSize);
			}
			pullIntoDescriptor.bytesFilled -= remainderSize;
			ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
			ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
		}
		function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
			const firstDescriptor = controller._pendingPullIntos.peek();
			ReadableByteStreamControllerInvalidateBYOBRequest(controller);
			if (controller._controlledReadableByteStream._state === "closed") ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
			else ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
			ReadableByteStreamControllerCallPullIfNeeded(controller);
		}
		function ReadableByteStreamControllerShiftPendingPullInto(controller) {
			return controller._pendingPullIntos.shift();
		}
		function ReadableByteStreamControllerShouldCallPull(controller) {
			const stream = controller._controlledReadableByteStream;
			if (stream._state !== "readable") return false;
			if (controller._closeRequested) return false;
			if (!controller._started) return false;
			if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) return true;
			if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) return true;
			if (ReadableByteStreamControllerGetDesiredSize(controller) > 0) return true;
			return false;
		}
		function ReadableByteStreamControllerClearAlgorithms(controller) {
			controller._pullAlgorithm = void 0;
			controller._cancelAlgorithm = void 0;
		}
		function ReadableByteStreamControllerClose(controller) {
			const stream = controller._controlledReadableByteStream;
			if (controller._closeRequested || stream._state !== "readable") return;
			if (controller._queueTotalSize > 0) {
				controller._closeRequested = true;
				return;
			}
			if (controller._pendingPullIntos.length > 0) {
				const firstPendingPullInto = controller._pendingPullIntos.peek();
				if (firstPendingPullInto.bytesFilled % firstPendingPullInto.elementSize !== 0) {
					const e$1 = /* @__PURE__ */ new TypeError("Insufficient bytes to fill elements in the given buffer");
					ReadableByteStreamControllerError(controller, e$1);
					throw e$1;
				}
			}
			ReadableByteStreamControllerClearAlgorithms(controller);
			ReadableStreamClose(stream);
		}
		function ReadableByteStreamControllerEnqueue(controller, chunk) {
			const stream = controller._controlledReadableByteStream;
			if (controller._closeRequested || stream._state !== "readable") return;
			const { buffer, byteOffset, byteLength } = chunk;
			if (IsDetachedBuffer(buffer)) throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
			const transferredBuffer = TransferArrayBuffer(buffer);
			if (controller._pendingPullIntos.length > 0) {
				const firstPendingPullInto = controller._pendingPullIntos.peek();
				if (IsDetachedBuffer(firstPendingPullInto.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
				ReadableByteStreamControllerInvalidateBYOBRequest(controller);
				firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
				if (firstPendingPullInto.readerType === "none") ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstPendingPullInto);
			}
			if (ReadableStreamHasDefaultReader(stream)) {
				ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller);
				if (ReadableStreamGetNumReadRequests(stream) === 0) ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
				else {
					if (controller._pendingPullIntos.length > 0) ReadableByteStreamControllerShiftPendingPullInto(controller);
					ReadableStreamFulfillReadRequest(stream, new Uint8Array(transferredBuffer, byteOffset, byteLength), false);
				}
			} else if (ReadableStreamHasBYOBReader(stream)) {
				ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
				ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
			} else ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
			ReadableByteStreamControllerCallPullIfNeeded(controller);
		}
		function ReadableByteStreamControllerError(controller, e$1) {
			const stream = controller._controlledReadableByteStream;
			if (stream._state !== "readable") return;
			ReadableByteStreamControllerClearPendingPullIntos(controller);
			ResetQueue(controller);
			ReadableByteStreamControllerClearAlgorithms(controller);
			ReadableStreamError(stream, e$1);
		}
		function ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest) {
			const entry = controller._queue.shift();
			controller._queueTotalSize -= entry.byteLength;
			ReadableByteStreamControllerHandleQueueDrain(controller);
			const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
			readRequest._chunkSteps(view);
		}
		function ReadableByteStreamControllerGetBYOBRequest(controller) {
			if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
				const firstDescriptor = controller._pendingPullIntos.peek();
				const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
				const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
				SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
				controller._byobRequest = byobRequest;
			}
			return controller._byobRequest;
		}
		function ReadableByteStreamControllerGetDesiredSize(controller) {
			const state = controller._controlledReadableByteStream._state;
			if (state === "errored") return null;
			if (state === "closed") return 0;
			return controller._strategyHWM - controller._queueTotalSize;
		}
		function ReadableByteStreamControllerRespond(controller, bytesWritten) {
			const firstDescriptor = controller._pendingPullIntos.peek();
			if (controller._controlledReadableByteStream._state === "closed") {
				if (bytesWritten !== 0) throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
			} else {
				if (bytesWritten === 0) throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
				if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) throw new RangeError("bytesWritten out of range");
			}
			firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
			ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
		}
		function ReadableByteStreamControllerRespondWithNewView(controller, view) {
			const firstDescriptor = controller._pendingPullIntos.peek();
			if (controller._controlledReadableByteStream._state === "closed") {
				if (view.byteLength !== 0) throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
			} else if (view.byteLength === 0) throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
			if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) throw new RangeError("The region specified by view does not match byobRequest");
			if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) throw new RangeError("The buffer of view has different capacity than byobRequest");
			if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) throw new RangeError("The region specified by view is larger than byobRequest");
			const viewByteLength = view.byteLength;
			firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
			ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
		}
		function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
			controller._controlledReadableByteStream = stream;
			controller._pullAgain = false;
			controller._pulling = false;
			controller._byobRequest = null;
			controller._queue = controller._queueTotalSize = void 0;
			ResetQueue(controller);
			controller._closeRequested = false;
			controller._started = false;
			controller._strategyHWM = highWaterMark;
			controller._pullAlgorithm = pullAlgorithm;
			controller._cancelAlgorithm = cancelAlgorithm;
			controller._autoAllocateChunkSize = autoAllocateChunkSize;
			controller._pendingPullIntos = new SimpleQueue();
			stream._readableStreamController = controller;
			uponPromise(promiseResolvedWith(startAlgorithm()), () => {
				controller._started = true;
				ReadableByteStreamControllerCallPullIfNeeded(controller);
				return null;
			}, (r$1) => {
				ReadableByteStreamControllerError(controller, r$1);
				return null;
			});
		}
		function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
			const controller = Object.create(ReadableByteStreamController.prototype);
			let startAlgorithm;
			let pullAlgorithm;
			let cancelAlgorithm;
			if (underlyingByteSource.start !== void 0) startAlgorithm = () => underlyingByteSource.start(controller);
			else startAlgorithm = () => void 0;
			if (underlyingByteSource.pull !== void 0) pullAlgorithm = () => underlyingByteSource.pull(controller);
			else pullAlgorithm = () => promiseResolvedWith(void 0);
			if (underlyingByteSource.cancel !== void 0) cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
			else cancelAlgorithm = () => promiseResolvedWith(void 0);
			const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
			if (autoAllocateChunkSize === 0) throw new TypeError("autoAllocateChunkSize must be greater than 0");
			SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
		}
		function SetUpReadableStreamBYOBRequest(request, controller, view) {
			request._associatedReadableByteStreamController = controller;
			request._view = view;
		}
		function byobRequestBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
		}
		function byteStreamControllerBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
		}
		function convertReaderOptions(options, context) {
			assertDictionary(options, context);
			const mode = options === null || options === void 0 ? void 0 : options.mode;
			return { mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`) };
		}
		function convertReadableStreamReaderMode(mode, context) {
			mode = `${mode}`;
			if (mode !== "byob") throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
			return mode;
		}
		function convertByobReadOptions(options, context) {
			var _a$1;
			assertDictionary(options, context);
			return { min: convertUnsignedLongLongWithEnforceRange((_a$1 = options === null || options === void 0 ? void 0 : options.min) !== null && _a$1 !== void 0 ? _a$1 : 1, `${context} has member 'min' that`) };
		}
		function AcquireReadableStreamBYOBReader(stream) {
			return new ReadableStreamBYOBReader(stream);
		}
		function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
			stream._reader._readIntoRequests.push(readIntoRequest);
		}
		function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
			const readIntoRequest = stream._reader._readIntoRequests.shift();
			if (done) readIntoRequest._closeSteps(chunk);
			else readIntoRequest._chunkSteps(chunk);
		}
		function ReadableStreamGetNumReadIntoRequests(stream) {
			return stream._reader._readIntoRequests.length;
		}
		function ReadableStreamHasBYOBReader(stream) {
			const reader = stream._reader;
			if (reader === void 0) return false;
			if (!IsReadableStreamBYOBReader(reader)) return false;
			return true;
		}
		/**
		* A BYOB reader vended by a {@link ReadableStream}.
		*
		* @public
		*/
		class ReadableStreamBYOBReader {
			constructor(stream) {
				assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
				assertReadableStream(stream, "First parameter");
				if (IsReadableStreamLocked(stream)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
				if (!IsReadableByteStreamController(stream._readableStreamController)) throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
				ReadableStreamReaderGenericInitialize(this, stream);
				this._readIntoRequests = new SimpleQueue();
			}
			/**
			* Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
			* the reader's lock is released before the stream finishes closing.
			*/
			get closed() {
				if (!IsReadableStreamBYOBReader(this)) return promiseRejectedWith(byobReaderBrandCheckException("closed"));
				return this._closedPromise;
			}
			/**
			* If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
			*/
			cancel(reason = void 0) {
				if (!IsReadableStreamBYOBReader(this)) return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
				if (this._ownerReadableStream === void 0) return promiseRejectedWith(readerLockException("cancel"));
				return ReadableStreamReaderGenericCancel(this, reason);
			}
			read(view, rawOptions = {}) {
				if (!IsReadableStreamBYOBReader(this)) return promiseRejectedWith(byobReaderBrandCheckException("read"));
				if (!ArrayBuffer.isView(view)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("view must be an array buffer view"));
				if (view.byteLength === 0) return promiseRejectedWith(/* @__PURE__ */ new TypeError("view must have non-zero byteLength"));
				if (view.buffer.byteLength === 0) return promiseRejectedWith(/* @__PURE__ */ new TypeError(`view's buffer must have non-zero byteLength`));
				if (IsDetachedBuffer(view.buffer)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("view's buffer has been detached"));
				let options;
				try {
					options = convertByobReadOptions(rawOptions, "options");
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
				const min = options.min;
				if (min === 0) return promiseRejectedWith(/* @__PURE__ */ new TypeError("options.min must be greater than 0"));
				if (!isDataView(view)) {
					if (min > view.length) return promiseRejectedWith(/* @__PURE__ */ new RangeError("options.min must be less than or equal to view's length"));
				} else if (min > view.byteLength) return promiseRejectedWith(/* @__PURE__ */ new RangeError("options.min must be less than or equal to view's byteLength"));
				if (this._ownerReadableStream === void 0) return promiseRejectedWith(readerLockException("read from"));
				let resolvePromise;
				let rejectPromise;
				const promise = newPromise((resolve, reject) => {
					resolvePromise = resolve;
					rejectPromise = reject;
				});
				ReadableStreamBYOBReaderRead(this, view, min, {
					_chunkSteps: (chunk) => resolvePromise({
						value: chunk,
						done: false
					}),
					_closeSteps: (chunk) => resolvePromise({
						value: chunk,
						done: true
					}),
					_errorSteps: (e$1) => rejectPromise(e$1)
				});
				return promise;
			}
			/**
			* Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
			* If the associated stream is errored when the lock is released, the reader will appear errored in the same way
			* from now on; otherwise, the reader will appear closed.
			*
			* A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
			* the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
			* do so will throw a `TypeError` and leave the reader locked to the stream.
			*/
			releaseLock() {
				if (!IsReadableStreamBYOBReader(this)) throw byobReaderBrandCheckException("releaseLock");
				if (this._ownerReadableStream === void 0) return;
				ReadableStreamBYOBReaderRelease(this);
			}
		}
		Object.defineProperties(ReadableStreamBYOBReader.prototype, {
			cancel: { enumerable: true },
			read: { enumerable: true },
			releaseLock: { enumerable: true },
			closed: { enumerable: true }
		});
		setFunctionName(ReadableStreamBYOBReader.prototype.cancel, "cancel");
		setFunctionName(ReadableStreamBYOBReader.prototype.read, "read");
		setFunctionName(ReadableStreamBYOBReader.prototype.releaseLock, "releaseLock");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ReadableStreamBYOBReader.prototype, Symbol.toStringTag, {
			value: "ReadableStreamBYOBReader",
			configurable: true
		});
		function IsReadableStreamBYOBReader(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_readIntoRequests")) return false;
			return x$1 instanceof ReadableStreamBYOBReader;
		}
		function ReadableStreamBYOBReaderRead(reader, view, min, readIntoRequest) {
			const stream = reader._ownerReadableStream;
			stream._disturbed = true;
			if (stream._state === "errored") readIntoRequest._errorSteps(stream._storedError);
			else ReadableByteStreamControllerPullInto(stream._readableStreamController, view, min, readIntoRequest);
		}
		function ReadableStreamBYOBReaderRelease(reader) {
			ReadableStreamReaderGenericRelease(reader);
			ReadableStreamBYOBReaderErrorReadIntoRequests(reader, /* @__PURE__ */ new TypeError("Reader was released"));
		}
		function ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e$1) {
			const readIntoRequests = reader._readIntoRequests;
			reader._readIntoRequests = new SimpleQueue();
			readIntoRequests.forEach((readIntoRequest) => {
				readIntoRequest._errorSteps(e$1);
			});
		}
		function byobReaderBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
		}
		function ExtractHighWaterMark(strategy, defaultHWM) {
			const { highWaterMark } = strategy;
			if (highWaterMark === void 0) return defaultHWM;
			if (NumberIsNaN(highWaterMark) || highWaterMark < 0) throw new RangeError("Invalid highWaterMark");
			return highWaterMark;
		}
		function ExtractSizeAlgorithm(strategy) {
			const { size } = strategy;
			if (!size) return () => 1;
			return size;
		}
		function convertQueuingStrategy(init, context) {
			assertDictionary(init, context);
			const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
			const size = init === null || init === void 0 ? void 0 : init.size;
			return {
				highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
				size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
			};
		}
		function convertQueuingStrategySize(fn, context) {
			assertFunction(fn, context);
			return (chunk) => convertUnrestrictedDouble(fn(chunk));
		}
		function convertUnderlyingSink(original, context) {
			assertDictionary(original, context);
			const abort = original === null || original === void 0 ? void 0 : original.abort;
			const close = original === null || original === void 0 ? void 0 : original.close;
			const start = original === null || original === void 0 ? void 0 : original.start;
			const type = original === null || original === void 0 ? void 0 : original.type;
			const write = original === null || original === void 0 ? void 0 : original.write;
			return {
				abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
				close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
				start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
				write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
				type
			};
		}
		function convertUnderlyingSinkAbortCallback(fn, original, context) {
			assertFunction(fn, context);
			return (reason) => promiseCall(fn, original, [reason]);
		}
		function convertUnderlyingSinkCloseCallback(fn, original, context) {
			assertFunction(fn, context);
			return () => promiseCall(fn, original, []);
		}
		function convertUnderlyingSinkStartCallback(fn, original, context) {
			assertFunction(fn, context);
			return (controller) => reflectCall(fn, original, [controller]);
		}
		function convertUnderlyingSinkWriteCallback(fn, original, context) {
			assertFunction(fn, context);
			return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
		}
		function assertWritableStream(x$1, context) {
			if (!IsWritableStream(x$1)) throw new TypeError(`${context} is not a WritableStream.`);
		}
		function isAbortSignal(value) {
			if (typeof value !== "object" || value === null) return false;
			try {
				return typeof value.aborted === "boolean";
			} catch (_a$1) {
				return false;
			}
		}
		const supportsAbortController = typeof AbortController === "function";
		/**
		* Construct a new AbortController, if supported by the platform.
		*
		* @internal
		*/
		function createAbortController() {
			if (supportsAbortController) return new AbortController();
		}
		/**
		* A writable stream represents a destination for data, into which you can write.
		*
		* @public
		*/
		class WritableStream {
			constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
				if (rawUnderlyingSink === void 0) rawUnderlyingSink = null;
				else assertObject(rawUnderlyingSink, "First parameter");
				const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
				const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
				InitializeWritableStream(this);
				if (underlyingSink.type !== void 0) throw new RangeError("Invalid type is specified");
				const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
				const highWaterMark = ExtractHighWaterMark(strategy, 1);
				SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
			}
			/**
			* Returns whether or not the writable stream is locked to a writer.
			*/
			get locked() {
				if (!IsWritableStream(this)) throw streamBrandCheckException$2("locked");
				return IsWritableStreamLocked(this);
			}
			/**
			* Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
			* immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
			* mechanism of the underlying sink.
			*
			* The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
			* that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
			* the stream) if the stream is currently locked.
			*/
			abort(reason = void 0) {
				if (!IsWritableStream(this)) return promiseRejectedWith(streamBrandCheckException$2("abort"));
				if (IsWritableStreamLocked(this)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("Cannot abort a stream that already has a writer"));
				return WritableStreamAbort(this, reason);
			}
			/**
			* Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
			* close behavior. During this time any further attempts to write will fail (without erroring the stream).
			*
			* The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
			* successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
			* a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
			*/
			close() {
				if (!IsWritableStream(this)) return promiseRejectedWith(streamBrandCheckException$2("close"));
				if (IsWritableStreamLocked(this)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("Cannot close a stream that already has a writer"));
				if (WritableStreamCloseQueuedOrInFlight(this)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("Cannot close an already-closing stream"));
				return WritableStreamClose(this);
			}
			/**
			* Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
			* is locked, no other writer can be acquired until this one is released.
			*
			* This functionality is especially useful for creating abstractions that desire the ability to write to a stream
			* without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
			* the same time, which would cause the resulting written data to be unpredictable and probably useless.
			*/
			getWriter() {
				if (!IsWritableStream(this)) throw streamBrandCheckException$2("getWriter");
				return AcquireWritableStreamDefaultWriter(this);
			}
		}
		Object.defineProperties(WritableStream.prototype, {
			abort: { enumerable: true },
			close: { enumerable: true },
			getWriter: { enumerable: true },
			locked: { enumerable: true }
		});
		setFunctionName(WritableStream.prototype.abort, "abort");
		setFunctionName(WritableStream.prototype.close, "close");
		setFunctionName(WritableStream.prototype.getWriter, "getWriter");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(WritableStream.prototype, Symbol.toStringTag, {
			value: "WritableStream",
			configurable: true
		});
		function AcquireWritableStreamDefaultWriter(stream) {
			return new WritableStreamDefaultWriter(stream);
		}
		function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
			const stream = Object.create(WritableStream.prototype);
			InitializeWritableStream(stream);
			SetUpWritableStreamDefaultController(stream, Object.create(WritableStreamDefaultController.prototype), startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
			return stream;
		}
		function InitializeWritableStream(stream) {
			stream._state = "writable";
			stream._storedError = void 0;
			stream._writer = void 0;
			stream._writableStreamController = void 0;
			stream._writeRequests = new SimpleQueue();
			stream._inFlightWriteRequest = void 0;
			stream._closeRequest = void 0;
			stream._inFlightCloseRequest = void 0;
			stream._pendingAbortRequest = void 0;
			stream._backpressure = false;
		}
		function IsWritableStream(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_writableStreamController")) return false;
			return x$1 instanceof WritableStream;
		}
		function IsWritableStreamLocked(stream) {
			if (stream._writer === void 0) return false;
			return true;
		}
		function WritableStreamAbort(stream, reason) {
			var _a$1;
			if (stream._state === "closed" || stream._state === "errored") return promiseResolvedWith(void 0);
			stream._writableStreamController._abortReason = reason;
			(_a$1 = stream._writableStreamController._abortController) === null || _a$1 === void 0 || _a$1.abort(reason);
			const state = stream._state;
			if (state === "closed" || state === "errored") return promiseResolvedWith(void 0);
			if (stream._pendingAbortRequest !== void 0) return stream._pendingAbortRequest._promise;
			let wasAlreadyErroring = false;
			if (state === "erroring") {
				wasAlreadyErroring = true;
				reason = void 0;
			}
			const promise = newPromise((resolve, reject) => {
				stream._pendingAbortRequest = {
					_promise: void 0,
					_resolve: resolve,
					_reject: reject,
					_reason: reason,
					_wasAlreadyErroring: wasAlreadyErroring
				};
			});
			stream._pendingAbortRequest._promise = promise;
			if (!wasAlreadyErroring) WritableStreamStartErroring(stream, reason);
			return promise;
		}
		function WritableStreamClose(stream) {
			const state = stream._state;
			if (state === "closed" || state === "errored") return promiseRejectedWith(/* @__PURE__ */ new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
			const promise = newPromise((resolve, reject) => {
				stream._closeRequest = {
					_resolve: resolve,
					_reject: reject
				};
			});
			const writer = stream._writer;
			if (writer !== void 0 && stream._backpressure && state === "writable") defaultWriterReadyPromiseResolve(writer);
			WritableStreamDefaultControllerClose(stream._writableStreamController);
			return promise;
		}
		function WritableStreamAddWriteRequest(stream) {
			return newPromise((resolve, reject) => {
				const writeRequest = {
					_resolve: resolve,
					_reject: reject
				};
				stream._writeRequests.push(writeRequest);
			});
		}
		function WritableStreamDealWithRejection(stream, error) {
			if (stream._state === "writable") {
				WritableStreamStartErroring(stream, error);
				return;
			}
			WritableStreamFinishErroring(stream);
		}
		function WritableStreamStartErroring(stream, reason) {
			const controller = stream._writableStreamController;
			stream._state = "erroring";
			stream._storedError = reason;
			const writer = stream._writer;
			if (writer !== void 0) WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
			if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) WritableStreamFinishErroring(stream);
		}
		function WritableStreamFinishErroring(stream) {
			stream._state = "errored";
			stream._writableStreamController[ErrorSteps]();
			const storedError = stream._storedError;
			stream._writeRequests.forEach((writeRequest) => {
				writeRequest._reject(storedError);
			});
			stream._writeRequests = new SimpleQueue();
			if (stream._pendingAbortRequest === void 0) {
				WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				return;
			}
			const abortRequest = stream._pendingAbortRequest;
			stream._pendingAbortRequest = void 0;
			if (abortRequest._wasAlreadyErroring) {
				abortRequest._reject(storedError);
				WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				return;
			}
			uponPromise(stream._writableStreamController[AbortSteps](abortRequest._reason), () => {
				abortRequest._resolve();
				WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				return null;
			}, (reason) => {
				abortRequest._reject(reason);
				WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
				return null;
			});
		}
		function WritableStreamFinishInFlightWrite(stream) {
			stream._inFlightWriteRequest._resolve(void 0);
			stream._inFlightWriteRequest = void 0;
		}
		function WritableStreamFinishInFlightWriteWithError(stream, error) {
			stream._inFlightWriteRequest._reject(error);
			stream._inFlightWriteRequest = void 0;
			WritableStreamDealWithRejection(stream, error);
		}
		function WritableStreamFinishInFlightClose(stream) {
			stream._inFlightCloseRequest._resolve(void 0);
			stream._inFlightCloseRequest = void 0;
			if (stream._state === "erroring") {
				stream._storedError = void 0;
				if (stream._pendingAbortRequest !== void 0) {
					stream._pendingAbortRequest._resolve();
					stream._pendingAbortRequest = void 0;
				}
			}
			stream._state = "closed";
			const writer = stream._writer;
			if (writer !== void 0) defaultWriterClosedPromiseResolve(writer);
		}
		function WritableStreamFinishInFlightCloseWithError(stream, error) {
			stream._inFlightCloseRequest._reject(error);
			stream._inFlightCloseRequest = void 0;
			if (stream._pendingAbortRequest !== void 0) {
				stream._pendingAbortRequest._reject(error);
				stream._pendingAbortRequest = void 0;
			}
			WritableStreamDealWithRejection(stream, error);
		}
		function WritableStreamCloseQueuedOrInFlight(stream) {
			if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) return false;
			return true;
		}
		function WritableStreamHasOperationMarkedInFlight(stream) {
			if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) return false;
			return true;
		}
		function WritableStreamMarkCloseRequestInFlight(stream) {
			stream._inFlightCloseRequest = stream._closeRequest;
			stream._closeRequest = void 0;
		}
		function WritableStreamMarkFirstWriteRequestInFlight(stream) {
			stream._inFlightWriteRequest = stream._writeRequests.shift();
		}
		function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
			if (stream._closeRequest !== void 0) {
				stream._closeRequest._reject(stream._storedError);
				stream._closeRequest = void 0;
			}
			const writer = stream._writer;
			if (writer !== void 0) defaultWriterClosedPromiseReject(writer, stream._storedError);
		}
		function WritableStreamUpdateBackpressure(stream, backpressure) {
			const writer = stream._writer;
			if (writer !== void 0 && backpressure !== stream._backpressure) if (backpressure) defaultWriterReadyPromiseReset(writer);
			else defaultWriterReadyPromiseResolve(writer);
			stream._backpressure = backpressure;
		}
		/**
		* A default writer vended by a {@link WritableStream}.
		*
		* @public
		*/
		class WritableStreamDefaultWriter {
			constructor(stream) {
				assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
				assertWritableStream(stream, "First parameter");
				if (IsWritableStreamLocked(stream)) throw new TypeError("This stream has already been locked for exclusive writing by another writer");
				this._ownerWritableStream = stream;
				stream._writer = this;
				const state = stream._state;
				if (state === "writable") {
					if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) defaultWriterReadyPromiseInitialize(this);
					else defaultWriterReadyPromiseInitializeAsResolved(this);
					defaultWriterClosedPromiseInitialize(this);
				} else if (state === "erroring") {
					defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
					defaultWriterClosedPromiseInitialize(this);
				} else if (state === "closed") {
					defaultWriterReadyPromiseInitializeAsResolved(this);
					defaultWriterClosedPromiseInitializeAsResolved(this);
				} else {
					const storedError = stream._storedError;
					defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
					defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
				}
			}
			/**
			* Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
			* the writer’s lock is released before the stream finishes closing.
			*/
			get closed() {
				if (!IsWritableStreamDefaultWriter(this)) return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
				return this._closedPromise;
			}
			/**
			* Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
			* A producer can use this information to determine the right amount of data to write.
			*
			* It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
			* queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
			* the writer’s lock is released.
			*/
			get desiredSize() {
				if (!IsWritableStreamDefaultWriter(this)) throw defaultWriterBrandCheckException("desiredSize");
				if (this._ownerWritableStream === void 0) throw defaultWriterLockException("desiredSize");
				return WritableStreamDefaultWriterGetDesiredSize(this);
			}
			/**
			* Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
			* from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
			* back to zero or below, the getter will return a new promise that stays pending until the next transition.
			*
			* If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
			* rejected.
			*/
			get ready() {
				if (!IsWritableStreamDefaultWriter(this)) return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
				return this._readyPromise;
			}
			/**
			* If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
			*/
			abort(reason = void 0) {
				if (!IsWritableStreamDefaultWriter(this)) return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
				if (this._ownerWritableStream === void 0) return promiseRejectedWith(defaultWriterLockException("abort"));
				return WritableStreamDefaultWriterAbort(this, reason);
			}
			/**
			* If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
			*/
			close() {
				if (!IsWritableStreamDefaultWriter(this)) return promiseRejectedWith(defaultWriterBrandCheckException("close"));
				const stream = this._ownerWritableStream;
				if (stream === void 0) return promiseRejectedWith(defaultWriterLockException("close"));
				if (WritableStreamCloseQueuedOrInFlight(stream)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("Cannot close an already-closing stream"));
				return WritableStreamDefaultWriterClose(this);
			}
			/**
			* Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
			* If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
			* now on; otherwise, the writer will appear closed.
			*
			* Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
			* promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
			* It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
			* other producers from writing in an interleaved manner.
			*/
			releaseLock() {
				if (!IsWritableStreamDefaultWriter(this)) throw defaultWriterBrandCheckException("releaseLock");
				if (this._ownerWritableStream === void 0) return;
				WritableStreamDefaultWriterRelease(this);
			}
			write(chunk = void 0) {
				if (!IsWritableStreamDefaultWriter(this)) return promiseRejectedWith(defaultWriterBrandCheckException("write"));
				if (this._ownerWritableStream === void 0) return promiseRejectedWith(defaultWriterLockException("write to"));
				return WritableStreamDefaultWriterWrite(this, chunk);
			}
		}
		Object.defineProperties(WritableStreamDefaultWriter.prototype, {
			abort: { enumerable: true },
			close: { enumerable: true },
			releaseLock: { enumerable: true },
			write: { enumerable: true },
			closed: { enumerable: true },
			desiredSize: { enumerable: true },
			ready: { enumerable: true }
		});
		setFunctionName(WritableStreamDefaultWriter.prototype.abort, "abort");
		setFunctionName(WritableStreamDefaultWriter.prototype.close, "close");
		setFunctionName(WritableStreamDefaultWriter.prototype.releaseLock, "releaseLock");
		setFunctionName(WritableStreamDefaultWriter.prototype.write, "write");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(WritableStreamDefaultWriter.prototype, Symbol.toStringTag, {
			value: "WritableStreamDefaultWriter",
			configurable: true
		});
		function IsWritableStreamDefaultWriter(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_ownerWritableStream")) return false;
			return x$1 instanceof WritableStreamDefaultWriter;
		}
		function WritableStreamDefaultWriterAbort(writer, reason) {
			const stream = writer._ownerWritableStream;
			return WritableStreamAbort(stream, reason);
		}
		function WritableStreamDefaultWriterClose(writer) {
			const stream = writer._ownerWritableStream;
			return WritableStreamClose(stream);
		}
		function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
			const stream = writer._ownerWritableStream;
			const state = stream._state;
			if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") return promiseResolvedWith(void 0);
			if (state === "errored") return promiseRejectedWith(stream._storedError);
			return WritableStreamDefaultWriterClose(writer);
		}
		function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
			if (writer._closedPromiseState === "pending") defaultWriterClosedPromiseReject(writer, error);
			else defaultWriterClosedPromiseResetToRejected(writer, error);
		}
		function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
			if (writer._readyPromiseState === "pending") defaultWriterReadyPromiseReject(writer, error);
			else defaultWriterReadyPromiseResetToRejected(writer, error);
		}
		function WritableStreamDefaultWriterGetDesiredSize(writer) {
			const stream = writer._ownerWritableStream;
			const state = stream._state;
			if (state === "errored" || state === "erroring") return null;
			if (state === "closed") return 0;
			return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
		}
		function WritableStreamDefaultWriterRelease(writer) {
			const stream = writer._ownerWritableStream;
			const releasedError = /* @__PURE__ */ new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
			WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
			WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
			stream._writer = void 0;
			writer._ownerWritableStream = void 0;
		}
		function WritableStreamDefaultWriterWrite(writer, chunk) {
			const stream = writer._ownerWritableStream;
			const controller = stream._writableStreamController;
			const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
			if (stream !== writer._ownerWritableStream) return promiseRejectedWith(defaultWriterLockException("write to"));
			const state = stream._state;
			if (state === "errored") return promiseRejectedWith(stream._storedError);
			if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") return promiseRejectedWith(/* @__PURE__ */ new TypeError("The stream is closing or closed and cannot be written to"));
			if (state === "erroring") return promiseRejectedWith(stream._storedError);
			const promise = WritableStreamAddWriteRequest(stream);
			WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
			return promise;
		}
		const closeSentinel = {};
		/**
		* Allows control of a {@link WritableStream | writable stream}'s state and internal queue.
		*
		* @public
		*/
		class WritableStreamDefaultController {
			constructor() {
				throw new TypeError("Illegal constructor");
			}
			/**
			* The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
			*
			* @deprecated
			*  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
			*  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
			*/
			get abortReason() {
				if (!IsWritableStreamDefaultController(this)) throw defaultControllerBrandCheckException$2("abortReason");
				return this._abortReason;
			}
			/**
			* An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
			*/
			get signal() {
				if (!IsWritableStreamDefaultController(this)) throw defaultControllerBrandCheckException$2("signal");
				if (this._abortController === void 0) throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
				return this._abortController.signal;
			}
			/**
			* Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
			*
			* This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
			* sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
			* normal lifecycle of interactions with the underlying sink.
			*/
			error(e$1 = void 0) {
				if (!IsWritableStreamDefaultController(this)) throw defaultControllerBrandCheckException$2("error");
				if (this._controlledWritableStream._state !== "writable") return;
				WritableStreamDefaultControllerError(this, e$1);
			}
			/** @internal */
			[AbortSteps](reason) {
				const result = this._abortAlgorithm(reason);
				WritableStreamDefaultControllerClearAlgorithms(this);
				return result;
			}
			/** @internal */
			[ErrorSteps]() {
				ResetQueue(this);
			}
		}
		Object.defineProperties(WritableStreamDefaultController.prototype, {
			abortReason: { enumerable: true },
			signal: { enumerable: true },
			error: { enumerable: true }
		});
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(WritableStreamDefaultController.prototype, Symbol.toStringTag, {
			value: "WritableStreamDefaultController",
			configurable: true
		});
		function IsWritableStreamDefaultController(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_controlledWritableStream")) return false;
			return x$1 instanceof WritableStreamDefaultController;
		}
		function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
			controller._controlledWritableStream = stream;
			stream._writableStreamController = controller;
			controller._queue = void 0;
			controller._queueTotalSize = void 0;
			ResetQueue(controller);
			controller._abortReason = void 0;
			controller._abortController = createAbortController();
			controller._started = false;
			controller._strategySizeAlgorithm = sizeAlgorithm;
			controller._strategyHWM = highWaterMark;
			controller._writeAlgorithm = writeAlgorithm;
			controller._closeAlgorithm = closeAlgorithm;
			controller._abortAlgorithm = abortAlgorithm;
			WritableStreamUpdateBackpressure(stream, WritableStreamDefaultControllerGetBackpressure(controller));
			uponPromise(promiseResolvedWith(startAlgorithm()), () => {
				controller._started = true;
				WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
				return null;
			}, (r$1) => {
				controller._started = true;
				WritableStreamDealWithRejection(stream, r$1);
				return null;
			});
		}
		function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
			const controller = Object.create(WritableStreamDefaultController.prototype);
			let startAlgorithm;
			let writeAlgorithm;
			let closeAlgorithm;
			let abortAlgorithm;
			if (underlyingSink.start !== void 0) startAlgorithm = () => underlyingSink.start(controller);
			else startAlgorithm = () => void 0;
			if (underlyingSink.write !== void 0) writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
			else writeAlgorithm = () => promiseResolvedWith(void 0);
			if (underlyingSink.close !== void 0) closeAlgorithm = () => underlyingSink.close();
			else closeAlgorithm = () => promiseResolvedWith(void 0);
			if (underlyingSink.abort !== void 0) abortAlgorithm = (reason) => underlyingSink.abort(reason);
			else abortAlgorithm = () => promiseResolvedWith(void 0);
			SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
		}
		function WritableStreamDefaultControllerClearAlgorithms(controller) {
			controller._writeAlgorithm = void 0;
			controller._closeAlgorithm = void 0;
			controller._abortAlgorithm = void 0;
			controller._strategySizeAlgorithm = void 0;
		}
		function WritableStreamDefaultControllerClose(controller) {
			EnqueueValueWithSize(controller, closeSentinel, 0);
			WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
		}
		function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
			try {
				return controller._strategySizeAlgorithm(chunk);
			} catch (chunkSizeE) {
				WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
				return 1;
			}
		}
		function WritableStreamDefaultControllerGetDesiredSize(controller) {
			return controller._strategyHWM - controller._queueTotalSize;
		}
		function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
			try {
				EnqueueValueWithSize(controller, chunk, chunkSize);
			} catch (enqueueE) {
				WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
				return;
			}
			const stream = controller._controlledWritableStream;
			if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") WritableStreamUpdateBackpressure(stream, WritableStreamDefaultControllerGetBackpressure(controller));
			WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
		}
		function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
			const stream = controller._controlledWritableStream;
			if (!controller._started) return;
			if (stream._inFlightWriteRequest !== void 0) return;
			if (stream._state === "erroring") {
				WritableStreamFinishErroring(stream);
				return;
			}
			if (controller._queue.length === 0) return;
			const value = PeekQueueValue(controller);
			if (value === closeSentinel) WritableStreamDefaultControllerProcessClose(controller);
			else WritableStreamDefaultControllerProcessWrite(controller, value);
		}
		function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
			if (controller._controlledWritableStream._state === "writable") WritableStreamDefaultControllerError(controller, error);
		}
		function WritableStreamDefaultControllerProcessClose(controller) {
			const stream = controller._controlledWritableStream;
			WritableStreamMarkCloseRequestInFlight(stream);
			DequeueValue(controller);
			const sinkClosePromise = controller._closeAlgorithm();
			WritableStreamDefaultControllerClearAlgorithms(controller);
			uponPromise(sinkClosePromise, () => {
				WritableStreamFinishInFlightClose(stream);
				return null;
			}, (reason) => {
				WritableStreamFinishInFlightCloseWithError(stream, reason);
				return null;
			});
		}
		function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
			const stream = controller._controlledWritableStream;
			WritableStreamMarkFirstWriteRequestInFlight(stream);
			uponPromise(controller._writeAlgorithm(chunk), () => {
				WritableStreamFinishInFlightWrite(stream);
				const state = stream._state;
				DequeueValue(controller);
				if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") WritableStreamUpdateBackpressure(stream, WritableStreamDefaultControllerGetBackpressure(controller));
				WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
				return null;
			}, (reason) => {
				if (stream._state === "writable") WritableStreamDefaultControllerClearAlgorithms(controller);
				WritableStreamFinishInFlightWriteWithError(stream, reason);
				return null;
			});
		}
		function WritableStreamDefaultControllerGetBackpressure(controller) {
			return WritableStreamDefaultControllerGetDesiredSize(controller) <= 0;
		}
		function WritableStreamDefaultControllerError(controller, error) {
			const stream = controller._controlledWritableStream;
			WritableStreamDefaultControllerClearAlgorithms(controller);
			WritableStreamStartErroring(stream, error);
		}
		function streamBrandCheckException$2(name) {
			return /* @__PURE__ */ new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
		}
		function defaultControllerBrandCheckException$2(name) {
			return /* @__PURE__ */ new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
		}
		function defaultWriterBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
		}
		function defaultWriterLockException(name) {
			return /* @__PURE__ */ new TypeError("Cannot " + name + " a stream using a released writer");
		}
		function defaultWriterClosedPromiseInitialize(writer) {
			writer._closedPromise = newPromise((resolve, reject) => {
				writer._closedPromise_resolve = resolve;
				writer._closedPromise_reject = reject;
				writer._closedPromiseState = "pending";
			});
		}
		function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
			defaultWriterClosedPromiseInitialize(writer);
			defaultWriterClosedPromiseReject(writer, reason);
		}
		function defaultWriterClosedPromiseInitializeAsResolved(writer) {
			defaultWriterClosedPromiseInitialize(writer);
			defaultWriterClosedPromiseResolve(writer);
		}
		function defaultWriterClosedPromiseReject(writer, reason) {
			if (writer._closedPromise_reject === void 0) return;
			setPromiseIsHandledToTrue(writer._closedPromise);
			writer._closedPromise_reject(reason);
			writer._closedPromise_resolve = void 0;
			writer._closedPromise_reject = void 0;
			writer._closedPromiseState = "rejected";
		}
		function defaultWriterClosedPromiseResetToRejected(writer, reason) {
			defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
		}
		function defaultWriterClosedPromiseResolve(writer) {
			if (writer._closedPromise_resolve === void 0) return;
			writer._closedPromise_resolve(void 0);
			writer._closedPromise_resolve = void 0;
			writer._closedPromise_reject = void 0;
			writer._closedPromiseState = "resolved";
		}
		function defaultWriterReadyPromiseInitialize(writer) {
			writer._readyPromise = newPromise((resolve, reject) => {
				writer._readyPromise_resolve = resolve;
				writer._readyPromise_reject = reject;
			});
			writer._readyPromiseState = "pending";
		}
		function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
			defaultWriterReadyPromiseInitialize(writer);
			defaultWriterReadyPromiseReject(writer, reason);
		}
		function defaultWriterReadyPromiseInitializeAsResolved(writer) {
			defaultWriterReadyPromiseInitialize(writer);
			defaultWriterReadyPromiseResolve(writer);
		}
		function defaultWriterReadyPromiseReject(writer, reason) {
			if (writer._readyPromise_reject === void 0) return;
			setPromiseIsHandledToTrue(writer._readyPromise);
			writer._readyPromise_reject(reason);
			writer._readyPromise_resolve = void 0;
			writer._readyPromise_reject = void 0;
			writer._readyPromiseState = "rejected";
		}
		function defaultWriterReadyPromiseReset(writer) {
			defaultWriterReadyPromiseInitialize(writer);
		}
		function defaultWriterReadyPromiseResetToRejected(writer, reason) {
			defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
		}
		function defaultWriterReadyPromiseResolve(writer) {
			if (writer._readyPromise_resolve === void 0) return;
			writer._readyPromise_resolve(void 0);
			writer._readyPromise_resolve = void 0;
			writer._readyPromise_reject = void 0;
			writer._readyPromiseState = "fulfilled";
		}
		function getGlobals() {
			if (typeof globalThis !== "undefined") return globalThis;
			else if (typeof self !== "undefined") return self;
			else if (typeof global !== "undefined") return global;
		}
		const globals = getGlobals();
		function isDOMExceptionConstructor(ctor) {
			if (!(typeof ctor === "function" || typeof ctor === "object")) return false;
			if (ctor.name !== "DOMException") return false;
			try {
				new ctor();
				return true;
			} catch (_a$1) {
				return false;
			}
		}
		/**
		* Support:
		* - Web browsers
		* - Node 18 and higher (https://github.com/nodejs/node/commit/e4b1fb5e6422c1ff151234bb9de792d45dd88d87)
		*/
		function getFromGlobal() {
			const ctor = globals === null || globals === void 0 ? void 0 : globals.DOMException;
			return isDOMExceptionConstructor(ctor) ? ctor : void 0;
		}
		/**
		* Support:
		* - All platforms
		*/
		function createPolyfill() {
			const ctor = function DOMException$2(message, name) {
				this.message = message || "";
				this.name = name || "Error";
				if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
			};
			setFunctionName(ctor, "DOMException");
			ctor.prototype = Object.create(Error.prototype);
			Object.defineProperty(ctor.prototype, "constructor", {
				value: ctor,
				writable: true,
				configurable: true
			});
			return ctor;
		}
		const DOMException$1 = getFromGlobal() || createPolyfill();
		function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
			const reader = AcquireReadableStreamDefaultReader(source);
			const writer = AcquireWritableStreamDefaultWriter(dest);
			source._disturbed = true;
			let shuttingDown = false;
			let currentWrite = promiseResolvedWith(void 0);
			return newPromise((resolve, reject) => {
				let abortAlgorithm;
				if (signal !== void 0) {
					abortAlgorithm = () => {
						const error = signal.reason !== void 0 ? signal.reason : new DOMException$1("Aborted", "AbortError");
						const actions = [];
						if (!preventAbort) actions.push(() => {
							if (dest._state === "writable") return WritableStreamAbort(dest, error);
							return promiseResolvedWith(void 0);
						});
						if (!preventCancel) actions.push(() => {
							if (source._state === "readable") return ReadableStreamCancel(source, error);
							return promiseResolvedWith(void 0);
						});
						shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
					};
					if (signal.aborted) {
						abortAlgorithm();
						return;
					}
					signal.addEventListener("abort", abortAlgorithm);
				}
				function pipeLoop() {
					return newPromise((resolveLoop, rejectLoop) => {
						function next(done) {
							if (done) resolveLoop();
							else PerformPromiseThen(pipeStep(), next, rejectLoop);
						}
						next(false);
					});
				}
				function pipeStep() {
					if (shuttingDown) return promiseResolvedWith(true);
					return PerformPromiseThen(writer._readyPromise, () => {
						return newPromise((resolveRead, rejectRead) => {
							ReadableStreamDefaultReaderRead(reader, {
								_chunkSteps: (chunk) => {
									currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop);
									resolveRead(false);
								},
								_closeSteps: () => resolveRead(true),
								_errorSteps: rejectRead
							});
						});
					});
				}
				isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
					if (!preventAbort) shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
					else shutdown(true, storedError);
					return null;
				});
				isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
					if (!preventCancel) shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
					else shutdown(true, storedError);
					return null;
				});
				isOrBecomesClosed(source, reader._closedPromise, () => {
					if (!preventClose) shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
					else shutdown();
					return null;
				});
				if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
					const destClosed = /* @__PURE__ */ new TypeError("the destination writable stream closed before all data could be piped to it");
					if (!preventCancel) shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
					else shutdown(true, destClosed);
				}
				setPromiseIsHandledToTrue(pipeLoop());
				function waitForWritesToFinish() {
					const oldCurrentWrite = currentWrite;
					return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
				}
				function isOrBecomesErrored(stream, promise, action) {
					if (stream._state === "errored") action(stream._storedError);
					else uponRejection(promise, action);
				}
				function isOrBecomesClosed(stream, promise, action) {
					if (stream._state === "closed") action();
					else uponFulfillment(promise, action);
				}
				function shutdownWithAction(action, originalIsError, originalError) {
					if (shuttingDown) return;
					shuttingDown = true;
					if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) uponFulfillment(waitForWritesToFinish(), doTheRest);
					else doTheRest();
					function doTheRest() {
						uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
						return null;
					}
				}
				function shutdown(isError, error) {
					if (shuttingDown) return;
					shuttingDown = true;
					if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
					else finalize(isError, error);
				}
				function finalize(isError, error) {
					WritableStreamDefaultWriterRelease(writer);
					ReadableStreamReaderGenericRelease(reader);
					if (signal !== void 0) signal.removeEventListener("abort", abortAlgorithm);
					if (isError) reject(error);
					else resolve(void 0);
					return null;
				}
			});
		}
		/**
		* Allows control of a {@link ReadableStream | readable stream}'s state and internal queue.
		*
		* @public
		*/
		class ReadableStreamDefaultController {
			constructor() {
				throw new TypeError("Illegal constructor");
			}
			/**
			* Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
			* over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
			*/
			get desiredSize() {
				if (!IsReadableStreamDefaultController(this)) throw defaultControllerBrandCheckException$1("desiredSize");
				return ReadableStreamDefaultControllerGetDesiredSize(this);
			}
			/**
			* Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
			* the stream, but once those are read, the stream will become closed.
			*/
			close() {
				if (!IsReadableStreamDefaultController(this)) throw defaultControllerBrandCheckException$1("close");
				if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) throw new TypeError("The stream is not in a state that permits close");
				ReadableStreamDefaultControllerClose(this);
			}
			enqueue(chunk = void 0) {
				if (!IsReadableStreamDefaultController(this)) throw defaultControllerBrandCheckException$1("enqueue");
				if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) throw new TypeError("The stream is not in a state that permits enqueue");
				return ReadableStreamDefaultControllerEnqueue(this, chunk);
			}
			/**
			* Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
			*/
			error(e$1 = void 0) {
				if (!IsReadableStreamDefaultController(this)) throw defaultControllerBrandCheckException$1("error");
				ReadableStreamDefaultControllerError(this, e$1);
			}
			/** @internal */
			[CancelSteps](reason) {
				ResetQueue(this);
				const result = this._cancelAlgorithm(reason);
				ReadableStreamDefaultControllerClearAlgorithms(this);
				return result;
			}
			/** @internal */
			[PullSteps](readRequest) {
				const stream = this._controlledReadableStream;
				if (this._queue.length > 0) {
					const chunk = DequeueValue(this);
					if (this._closeRequested && this._queue.length === 0) {
						ReadableStreamDefaultControllerClearAlgorithms(this);
						ReadableStreamClose(stream);
					} else ReadableStreamDefaultControllerCallPullIfNeeded(this);
					readRequest._chunkSteps(chunk);
				} else {
					ReadableStreamAddReadRequest(stream, readRequest);
					ReadableStreamDefaultControllerCallPullIfNeeded(this);
				}
			}
			/** @internal */
			[ReleaseSteps]() {}
		}
		Object.defineProperties(ReadableStreamDefaultController.prototype, {
			close: { enumerable: true },
			enqueue: { enumerable: true },
			error: { enumerable: true },
			desiredSize: { enumerable: true }
		});
		setFunctionName(ReadableStreamDefaultController.prototype.close, "close");
		setFunctionName(ReadableStreamDefaultController.prototype.enqueue, "enqueue");
		setFunctionName(ReadableStreamDefaultController.prototype.error, "error");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ReadableStreamDefaultController.prototype, Symbol.toStringTag, {
			value: "ReadableStreamDefaultController",
			configurable: true
		});
		function IsReadableStreamDefaultController(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_controlledReadableStream")) return false;
			return x$1 instanceof ReadableStreamDefaultController;
		}
		function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
			if (!ReadableStreamDefaultControllerShouldCallPull(controller)) return;
			if (controller._pulling) {
				controller._pullAgain = true;
				return;
			}
			controller._pulling = true;
			uponPromise(controller._pullAlgorithm(), () => {
				controller._pulling = false;
				if (controller._pullAgain) {
					controller._pullAgain = false;
					ReadableStreamDefaultControllerCallPullIfNeeded(controller);
				}
				return null;
			}, (e$1) => {
				ReadableStreamDefaultControllerError(controller, e$1);
				return null;
			});
		}
		function ReadableStreamDefaultControllerShouldCallPull(controller) {
			const stream = controller._controlledReadableStream;
			if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) return false;
			if (!controller._started) return false;
			if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) return true;
			if (ReadableStreamDefaultControllerGetDesiredSize(controller) > 0) return true;
			return false;
		}
		function ReadableStreamDefaultControllerClearAlgorithms(controller) {
			controller._pullAlgorithm = void 0;
			controller._cancelAlgorithm = void 0;
			controller._strategySizeAlgorithm = void 0;
		}
		function ReadableStreamDefaultControllerClose(controller) {
			if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) return;
			const stream = controller._controlledReadableStream;
			controller._closeRequested = true;
			if (controller._queue.length === 0) {
				ReadableStreamDefaultControllerClearAlgorithms(controller);
				ReadableStreamClose(stream);
			}
		}
		function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
			if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) return;
			const stream = controller._controlledReadableStream;
			if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) ReadableStreamFulfillReadRequest(stream, chunk, false);
			else {
				let chunkSize;
				try {
					chunkSize = controller._strategySizeAlgorithm(chunk);
				} catch (chunkSizeE) {
					ReadableStreamDefaultControllerError(controller, chunkSizeE);
					throw chunkSizeE;
				}
				try {
					EnqueueValueWithSize(controller, chunk, chunkSize);
				} catch (enqueueE) {
					ReadableStreamDefaultControllerError(controller, enqueueE);
					throw enqueueE;
				}
			}
			ReadableStreamDefaultControllerCallPullIfNeeded(controller);
		}
		function ReadableStreamDefaultControllerError(controller, e$1) {
			const stream = controller._controlledReadableStream;
			if (stream._state !== "readable") return;
			ResetQueue(controller);
			ReadableStreamDefaultControllerClearAlgorithms(controller);
			ReadableStreamError(stream, e$1);
		}
		function ReadableStreamDefaultControllerGetDesiredSize(controller) {
			const state = controller._controlledReadableStream._state;
			if (state === "errored") return null;
			if (state === "closed") return 0;
			return controller._strategyHWM - controller._queueTotalSize;
		}
		function ReadableStreamDefaultControllerHasBackpressure(controller) {
			if (ReadableStreamDefaultControllerShouldCallPull(controller)) return false;
			return true;
		}
		function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
			const state = controller._controlledReadableStream._state;
			if (!controller._closeRequested && state === "readable") return true;
			return false;
		}
		function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
			controller._controlledReadableStream = stream;
			controller._queue = void 0;
			controller._queueTotalSize = void 0;
			ResetQueue(controller);
			controller._started = false;
			controller._closeRequested = false;
			controller._pullAgain = false;
			controller._pulling = false;
			controller._strategySizeAlgorithm = sizeAlgorithm;
			controller._strategyHWM = highWaterMark;
			controller._pullAlgorithm = pullAlgorithm;
			controller._cancelAlgorithm = cancelAlgorithm;
			stream._readableStreamController = controller;
			uponPromise(promiseResolvedWith(startAlgorithm()), () => {
				controller._started = true;
				ReadableStreamDefaultControllerCallPullIfNeeded(controller);
				return null;
			}, (r$1) => {
				ReadableStreamDefaultControllerError(controller, r$1);
				return null;
			});
		}
		function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
			const controller = Object.create(ReadableStreamDefaultController.prototype);
			let startAlgorithm;
			let pullAlgorithm;
			let cancelAlgorithm;
			if (underlyingSource.start !== void 0) startAlgorithm = () => underlyingSource.start(controller);
			else startAlgorithm = () => void 0;
			if (underlyingSource.pull !== void 0) pullAlgorithm = () => underlyingSource.pull(controller);
			else pullAlgorithm = () => promiseResolvedWith(void 0);
			if (underlyingSource.cancel !== void 0) cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
			else cancelAlgorithm = () => promiseResolvedWith(void 0);
			SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
		}
		function defaultControllerBrandCheckException$1(name) {
			return /* @__PURE__ */ new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
		}
		function ReadableStreamTee(stream, cloneForBranch2) {
			if (IsReadableByteStreamController(stream._readableStreamController)) return ReadableByteStreamTee(stream);
			return ReadableStreamDefaultTee(stream);
		}
		function ReadableStreamDefaultTee(stream, cloneForBranch2) {
			const reader = AcquireReadableStreamDefaultReader(stream);
			let reading = false;
			let readAgain = false;
			let canceled1 = false;
			let canceled2 = false;
			let reason1;
			let reason2;
			let branch1;
			let branch2;
			let resolveCancelPromise;
			const cancelPromise = newPromise((resolve) => {
				resolveCancelPromise = resolve;
			});
			function pullAlgorithm() {
				if (reading) {
					readAgain = true;
					return promiseResolvedWith(void 0);
				}
				reading = true;
				ReadableStreamDefaultReaderRead(reader, {
					_chunkSteps: (chunk) => {
						_queueMicrotask(() => {
							readAgain = false;
							const chunk1 = chunk;
							const chunk2 = chunk;
							if (!canceled1) ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
							if (!canceled2) ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
							reading = false;
							if (readAgain) pullAlgorithm();
						});
					},
					_closeSteps: () => {
						reading = false;
						if (!canceled1) ReadableStreamDefaultControllerClose(branch1._readableStreamController);
						if (!canceled2) ReadableStreamDefaultControllerClose(branch2._readableStreamController);
						if (!canceled1 || !canceled2) resolveCancelPromise(void 0);
					},
					_errorSteps: () => {
						reading = false;
					}
				});
				return promiseResolvedWith(void 0);
			}
			function cancel1Algorithm(reason) {
				canceled1 = true;
				reason1 = reason;
				if (canceled2) {
					const cancelResult = ReadableStreamCancel(stream, CreateArrayFromList([reason1, reason2]));
					resolveCancelPromise(cancelResult);
				}
				return cancelPromise;
			}
			function cancel2Algorithm(reason) {
				canceled2 = true;
				reason2 = reason;
				if (canceled1) {
					const cancelResult = ReadableStreamCancel(stream, CreateArrayFromList([reason1, reason2]));
					resolveCancelPromise(cancelResult);
				}
				return cancelPromise;
			}
			function startAlgorithm() {}
			branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
			branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
			uponRejection(reader._closedPromise, (r$1) => {
				ReadableStreamDefaultControllerError(branch1._readableStreamController, r$1);
				ReadableStreamDefaultControllerError(branch2._readableStreamController, r$1);
				if (!canceled1 || !canceled2) resolveCancelPromise(void 0);
				return null;
			});
			return [branch1, branch2];
		}
		function ReadableByteStreamTee(stream) {
			let reader = AcquireReadableStreamDefaultReader(stream);
			let reading = false;
			let readAgainForBranch1 = false;
			let readAgainForBranch2 = false;
			let canceled1 = false;
			let canceled2 = false;
			let reason1;
			let reason2;
			let branch1;
			let branch2;
			let resolveCancelPromise;
			const cancelPromise = newPromise((resolve) => {
				resolveCancelPromise = resolve;
			});
			function forwardReaderError(thisReader) {
				uponRejection(thisReader._closedPromise, (r$1) => {
					if (thisReader !== reader) return null;
					ReadableByteStreamControllerError(branch1._readableStreamController, r$1);
					ReadableByteStreamControllerError(branch2._readableStreamController, r$1);
					if (!canceled1 || !canceled2) resolveCancelPromise(void 0);
					return null;
				});
			}
			function pullWithDefaultReader() {
				if (IsReadableStreamBYOBReader(reader)) {
					ReadableStreamReaderGenericRelease(reader);
					reader = AcquireReadableStreamDefaultReader(stream);
					forwardReaderError(reader);
				}
				ReadableStreamDefaultReaderRead(reader, {
					_chunkSteps: (chunk) => {
						_queueMicrotask(() => {
							readAgainForBranch1 = false;
							readAgainForBranch2 = false;
							const chunk1 = chunk;
							let chunk2 = chunk;
							if (!canceled1 && !canceled2) try {
								chunk2 = CloneAsUint8Array(chunk);
							} catch (cloneE) {
								ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
								ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
								resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
								return;
							}
							if (!canceled1) ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
							if (!canceled2) ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
							reading = false;
							if (readAgainForBranch1) pull1Algorithm();
							else if (readAgainForBranch2) pull2Algorithm();
						});
					},
					_closeSteps: () => {
						reading = false;
						if (!canceled1) ReadableByteStreamControllerClose(branch1._readableStreamController);
						if (!canceled2) ReadableByteStreamControllerClose(branch2._readableStreamController);
						if (branch1._readableStreamController._pendingPullIntos.length > 0) ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
						if (branch2._readableStreamController._pendingPullIntos.length > 0) ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
						if (!canceled1 || !canceled2) resolveCancelPromise(void 0);
					},
					_errorSteps: () => {
						reading = false;
					}
				});
			}
			function pullWithBYOBReader(view, forBranch2) {
				if (IsReadableStreamDefaultReader(reader)) {
					ReadableStreamReaderGenericRelease(reader);
					reader = AcquireReadableStreamBYOBReader(stream);
					forwardReaderError(reader);
				}
				const byobBranch = forBranch2 ? branch2 : branch1;
				const otherBranch = forBranch2 ? branch1 : branch2;
				ReadableStreamBYOBReaderRead(reader, view, 1, {
					_chunkSteps: (chunk) => {
						_queueMicrotask(() => {
							readAgainForBranch1 = false;
							readAgainForBranch2 = false;
							const byobCanceled = forBranch2 ? canceled2 : canceled1;
							if (!(forBranch2 ? canceled1 : canceled2)) {
								let clonedChunk;
								try {
									clonedChunk = CloneAsUint8Array(chunk);
								} catch (cloneE) {
									ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
									ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
									resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
									return;
								}
								if (!byobCanceled) ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
								ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
							} else if (!byobCanceled) ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
							reading = false;
							if (readAgainForBranch1) pull1Algorithm();
							else if (readAgainForBranch2) pull2Algorithm();
						});
					},
					_closeSteps: (chunk) => {
						reading = false;
						const byobCanceled = forBranch2 ? canceled2 : canceled1;
						const otherCanceled = forBranch2 ? canceled1 : canceled2;
						if (!byobCanceled) ReadableByteStreamControllerClose(byobBranch._readableStreamController);
						if (!otherCanceled) ReadableByteStreamControllerClose(otherBranch._readableStreamController);
						if (chunk !== void 0) {
							if (!byobCanceled) ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
							if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
						}
						if (!byobCanceled || !otherCanceled) resolveCancelPromise(void 0);
					},
					_errorSteps: () => {
						reading = false;
					}
				});
			}
			function pull1Algorithm() {
				if (reading) {
					readAgainForBranch1 = true;
					return promiseResolvedWith(void 0);
				}
				reading = true;
				const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
				if (byobRequest === null) pullWithDefaultReader();
				else pullWithBYOBReader(byobRequest._view, false);
				return promiseResolvedWith(void 0);
			}
			function pull2Algorithm() {
				if (reading) {
					readAgainForBranch2 = true;
					return promiseResolvedWith(void 0);
				}
				reading = true;
				const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
				if (byobRequest === null) pullWithDefaultReader();
				else pullWithBYOBReader(byobRequest._view, true);
				return promiseResolvedWith(void 0);
			}
			function cancel1Algorithm(reason) {
				canceled1 = true;
				reason1 = reason;
				if (canceled2) {
					const cancelResult = ReadableStreamCancel(stream, CreateArrayFromList([reason1, reason2]));
					resolveCancelPromise(cancelResult);
				}
				return cancelPromise;
			}
			function cancel2Algorithm(reason) {
				canceled2 = true;
				reason2 = reason;
				if (canceled1) {
					const cancelResult = ReadableStreamCancel(stream, CreateArrayFromList([reason1, reason2]));
					resolveCancelPromise(cancelResult);
				}
				return cancelPromise;
			}
			function startAlgorithm() {}
			branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
			branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
			forwardReaderError(reader);
			return [branch1, branch2];
		}
		function isReadableStreamLike(stream) {
			return typeIsObject(stream) && typeof stream.getReader !== "undefined";
		}
		function ReadableStreamFrom(source) {
			if (isReadableStreamLike(source)) return ReadableStreamFromDefaultReader(source.getReader());
			return ReadableStreamFromIterable(source);
		}
		function ReadableStreamFromIterable(asyncIterable) {
			let stream;
			const iteratorRecord = GetIterator(asyncIterable, "async");
			const startAlgorithm = noop;
			function pullAlgorithm() {
				let nextResult;
				try {
					nextResult = IteratorNext(iteratorRecord);
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
				return transformPromiseWith(promiseResolvedWith(nextResult), (iterResult) => {
					if (!typeIsObject(iterResult)) throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
					if (IteratorComplete(iterResult)) ReadableStreamDefaultControllerClose(stream._readableStreamController);
					else {
						const value = IteratorValue(iterResult);
						ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
					}
				});
			}
			function cancelAlgorithm(reason) {
				const iterator = iteratorRecord.iterator;
				let returnMethod;
				try {
					returnMethod = GetMethod(iterator, "return");
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
				if (returnMethod === void 0) return promiseResolvedWith(void 0);
				let returnResult;
				try {
					returnResult = reflectCall(returnMethod, iterator, [reason]);
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
				return transformPromiseWith(promiseResolvedWith(returnResult), (iterResult) => {
					if (!typeIsObject(iterResult)) throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
				});
			}
			stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
			return stream;
		}
		function ReadableStreamFromDefaultReader(reader) {
			let stream;
			const startAlgorithm = noop;
			function pullAlgorithm() {
				let readPromise;
				try {
					readPromise = reader.read();
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
				return transformPromiseWith(readPromise, (readResult) => {
					if (!typeIsObject(readResult)) throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
					if (readResult.done) ReadableStreamDefaultControllerClose(stream._readableStreamController);
					else {
						const value = readResult.value;
						ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
					}
				});
			}
			function cancelAlgorithm(reason) {
				try {
					return promiseResolvedWith(reader.cancel(reason));
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
			}
			stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
			return stream;
		}
		function convertUnderlyingDefaultOrByteSource(source, context) {
			assertDictionary(source, context);
			const original = source;
			const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
			const cancel = original === null || original === void 0 ? void 0 : original.cancel;
			const pull = original === null || original === void 0 ? void 0 : original.pull;
			const start = original === null || original === void 0 ? void 0 : original.start;
			const type = original === null || original === void 0 ? void 0 : original.type;
			return {
				autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
				cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
				pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
				start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
				type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
			};
		}
		function convertUnderlyingSourceCancelCallback(fn, original, context) {
			assertFunction(fn, context);
			return (reason) => promiseCall(fn, original, [reason]);
		}
		function convertUnderlyingSourcePullCallback(fn, original, context) {
			assertFunction(fn, context);
			return (controller) => promiseCall(fn, original, [controller]);
		}
		function convertUnderlyingSourceStartCallback(fn, original, context) {
			assertFunction(fn, context);
			return (controller) => reflectCall(fn, original, [controller]);
		}
		function convertReadableStreamType(type, context) {
			type = `${type}`;
			if (type !== "bytes") throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
			return type;
		}
		function convertIteratorOptions(options, context) {
			assertDictionary(options, context);
			const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
			return { preventCancel: Boolean(preventCancel) };
		}
		function convertPipeOptions(options, context) {
			assertDictionary(options, context);
			const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
			const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
			const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
			const signal = options === null || options === void 0 ? void 0 : options.signal;
			if (signal !== void 0) assertAbortSignal(signal, `${context} has member 'signal' that`);
			return {
				preventAbort: Boolean(preventAbort),
				preventCancel: Boolean(preventCancel),
				preventClose: Boolean(preventClose),
				signal
			};
		}
		function assertAbortSignal(signal, context) {
			if (!isAbortSignal(signal)) throw new TypeError(`${context} is not an AbortSignal.`);
		}
		function convertReadableWritablePair(pair, context) {
			assertDictionary(pair, context);
			const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
			assertRequiredField(readable, "readable", "ReadableWritablePair");
			assertReadableStream(readable, `${context} has member 'readable' that`);
			const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
			assertRequiredField(writable, "writable", "ReadableWritablePair");
			assertWritableStream(writable, `${context} has member 'writable' that`);
			return {
				readable,
				writable
			};
		}
		/**
		* A readable stream represents a source of data, from which you can read.
		*
		* @public
		*/
		class ReadableStream$1 {
			constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
				if (rawUnderlyingSource === void 0) rawUnderlyingSource = null;
				else assertObject(rawUnderlyingSource, "First parameter");
				const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
				const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
				InitializeReadableStream(this);
				if (underlyingSource.type === "bytes") {
					if (strategy.size !== void 0) throw new RangeError("The strategy for a byte stream cannot have a size function");
					const highWaterMark = ExtractHighWaterMark(strategy, 0);
					SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
				} else {
					const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
					const highWaterMark = ExtractHighWaterMark(strategy, 1);
					SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
				}
			}
			/**
			* Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
			*/
			get locked() {
				if (!IsReadableStream(this)) throw streamBrandCheckException$1("locked");
				return IsReadableStreamLocked(this);
			}
			/**
			* Cancels the stream, signaling a loss of interest in the stream by a consumer.
			*
			* The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
			* method, which might or might not use it.
			*/
			cancel(reason = void 0) {
				if (!IsReadableStream(this)) return promiseRejectedWith(streamBrandCheckException$1("cancel"));
				if (IsReadableStreamLocked(this)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("Cannot cancel a stream that already has a reader"));
				return ReadableStreamCancel(this, reason);
			}
			getReader(rawOptions = void 0) {
				if (!IsReadableStream(this)) throw streamBrandCheckException$1("getReader");
				if (convertReaderOptions(rawOptions, "First parameter").mode === void 0) return AcquireReadableStreamDefaultReader(this);
				return AcquireReadableStreamBYOBReader(this);
			}
			pipeThrough(rawTransform, rawOptions = {}) {
				if (!IsReadableStream(this)) throw streamBrandCheckException$1("pipeThrough");
				assertRequiredArgument(rawTransform, 1, "pipeThrough");
				const transform = convertReadableWritablePair(rawTransform, "First parameter");
				const options = convertPipeOptions(rawOptions, "Second parameter");
				if (IsReadableStreamLocked(this)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
				if (IsWritableStreamLocked(transform.writable)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
				setPromiseIsHandledToTrue(ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal));
				return transform.readable;
			}
			pipeTo(destination, rawOptions = {}) {
				if (!IsReadableStream(this)) return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
				if (destination === void 0) return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
				if (!IsWritableStream(destination)) return promiseRejectedWith(/* @__PURE__ */ new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
				let options;
				try {
					options = convertPipeOptions(rawOptions, "Second parameter");
				} catch (e$1) {
					return promiseRejectedWith(e$1);
				}
				if (IsReadableStreamLocked(this)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
				if (IsWritableStreamLocked(destination)) return promiseRejectedWith(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
				return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
			}
			/**
			* Tees this readable stream, returning a two-element array containing the two resulting branches as
			* new {@link ReadableStream} instances.
			*
			* Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
			* To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
			* propagated to the stream's underlying source.
			*
			* Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
			* this could allow interference between the two branches.
			*/
			tee() {
				if (!IsReadableStream(this)) throw streamBrandCheckException$1("tee");
				return CreateArrayFromList(ReadableStreamTee(this));
			}
			values(rawOptions = void 0) {
				if (!IsReadableStream(this)) throw streamBrandCheckException$1("values");
				const options = convertIteratorOptions(rawOptions, "First parameter");
				return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
			}
			[SymbolAsyncIterator](options) {
				return this.values(options);
			}
			/**
			* Creates a new ReadableStream wrapping the provided iterable or async iterable.
			*
			* This can be used to adapt various kinds of objects into a readable stream,
			* such as an array, an async generator, or a Node.js readable stream.
			*/
			static from(asyncIterable) {
				return ReadableStreamFrom(asyncIterable);
			}
		}
		Object.defineProperties(ReadableStream$1, { from: { enumerable: true } });
		Object.defineProperties(ReadableStream$1.prototype, {
			cancel: { enumerable: true },
			getReader: { enumerable: true },
			pipeThrough: { enumerable: true },
			pipeTo: { enumerable: true },
			tee: { enumerable: true },
			values: { enumerable: true },
			locked: { enumerable: true }
		});
		setFunctionName(ReadableStream$1.from, "from");
		setFunctionName(ReadableStream$1.prototype.cancel, "cancel");
		setFunctionName(ReadableStream$1.prototype.getReader, "getReader");
		setFunctionName(ReadableStream$1.prototype.pipeThrough, "pipeThrough");
		setFunctionName(ReadableStream$1.prototype.pipeTo, "pipeTo");
		setFunctionName(ReadableStream$1.prototype.tee, "tee");
		setFunctionName(ReadableStream$1.prototype.values, "values");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ReadableStream$1.prototype, Symbol.toStringTag, {
			value: "ReadableStream",
			configurable: true
		});
		Object.defineProperty(ReadableStream$1.prototype, SymbolAsyncIterator, {
			value: ReadableStream$1.prototype.values,
			writable: true,
			configurable: true
		});
		function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
			const stream = Object.create(ReadableStream$1.prototype);
			InitializeReadableStream(stream);
			SetUpReadableStreamDefaultController(stream, Object.create(ReadableStreamDefaultController.prototype), startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
			return stream;
		}
		function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
			const stream = Object.create(ReadableStream$1.prototype);
			InitializeReadableStream(stream);
			SetUpReadableByteStreamController(stream, Object.create(ReadableByteStreamController.prototype), startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
			return stream;
		}
		function InitializeReadableStream(stream) {
			stream._state = "readable";
			stream._reader = void 0;
			stream._storedError = void 0;
			stream._disturbed = false;
		}
		function IsReadableStream(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_readableStreamController")) return false;
			return x$1 instanceof ReadableStream$1;
		}
		function IsReadableStreamLocked(stream) {
			if (stream._reader === void 0) return false;
			return true;
		}
		function ReadableStreamCancel(stream, reason) {
			stream._disturbed = true;
			if (stream._state === "closed") return promiseResolvedWith(void 0);
			if (stream._state === "errored") return promiseRejectedWith(stream._storedError);
			ReadableStreamClose(stream);
			const reader = stream._reader;
			if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
				const readIntoRequests = reader._readIntoRequests;
				reader._readIntoRequests = new SimpleQueue();
				readIntoRequests.forEach((readIntoRequest) => {
					readIntoRequest._closeSteps(void 0);
				});
			}
			return transformPromiseWith(stream._readableStreamController[CancelSteps](reason), noop);
		}
		function ReadableStreamClose(stream) {
			stream._state = "closed";
			const reader = stream._reader;
			if (reader === void 0) return;
			defaultReaderClosedPromiseResolve(reader);
			if (IsReadableStreamDefaultReader(reader)) {
				const readRequests = reader._readRequests;
				reader._readRequests = new SimpleQueue();
				readRequests.forEach((readRequest) => {
					readRequest._closeSteps();
				});
			}
		}
		function ReadableStreamError(stream, e$1) {
			stream._state = "errored";
			stream._storedError = e$1;
			const reader = stream._reader;
			if (reader === void 0) return;
			defaultReaderClosedPromiseReject(reader, e$1);
			if (IsReadableStreamDefaultReader(reader)) ReadableStreamDefaultReaderErrorReadRequests(reader, e$1);
			else ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e$1);
		}
		function streamBrandCheckException$1(name) {
			return /* @__PURE__ */ new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
		}
		function convertQueuingStrategyInit(init, context) {
			assertDictionary(init, context);
			const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
			assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
			return { highWaterMark: convertUnrestrictedDouble(highWaterMark) };
		}
		const byteLengthSizeFunction = (chunk) => {
			return chunk.byteLength;
		};
		setFunctionName(byteLengthSizeFunction, "size");
		/**
		* A queuing strategy that counts the number of bytes in each chunk.
		*
		* @public
		*/
		class ByteLengthQueuingStrategy {
			constructor(options) {
				assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
				options = convertQueuingStrategyInit(options, "First parameter");
				this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
			}
			/**
			* Returns the high water mark provided to the constructor.
			*/
			get highWaterMark() {
				if (!IsByteLengthQueuingStrategy(this)) throw byteLengthBrandCheckException("highWaterMark");
				return this._byteLengthQueuingStrategyHighWaterMark;
			}
			/**
			* Measures the size of `chunk` by returning the value of its `byteLength` property.
			*/
			get size() {
				if (!IsByteLengthQueuingStrategy(this)) throw byteLengthBrandCheckException("size");
				return byteLengthSizeFunction;
			}
		}
		Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
			highWaterMark: { enumerable: true },
			size: { enumerable: true }
		});
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(ByteLengthQueuingStrategy.prototype, Symbol.toStringTag, {
			value: "ByteLengthQueuingStrategy",
			configurable: true
		});
		function byteLengthBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
		}
		function IsByteLengthQueuingStrategy(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_byteLengthQueuingStrategyHighWaterMark")) return false;
			return x$1 instanceof ByteLengthQueuingStrategy;
		}
		const countSizeFunction = () => {
			return 1;
		};
		setFunctionName(countSizeFunction, "size");
		/**
		* A queuing strategy that counts the number of chunks.
		*
		* @public
		*/
		class CountQueuingStrategy {
			constructor(options) {
				assertRequiredArgument(options, 1, "CountQueuingStrategy");
				options = convertQueuingStrategyInit(options, "First parameter");
				this._countQueuingStrategyHighWaterMark = options.highWaterMark;
			}
			/**
			* Returns the high water mark provided to the constructor.
			*/
			get highWaterMark() {
				if (!IsCountQueuingStrategy(this)) throw countBrandCheckException("highWaterMark");
				return this._countQueuingStrategyHighWaterMark;
			}
			/**
			* Measures the size of `chunk` by always returning 1.
			* This ensures that the total queue size is a count of the number of chunks in the queue.
			*/
			get size() {
				if (!IsCountQueuingStrategy(this)) throw countBrandCheckException("size");
				return countSizeFunction;
			}
		}
		Object.defineProperties(CountQueuingStrategy.prototype, {
			highWaterMark: { enumerable: true },
			size: { enumerable: true }
		});
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(CountQueuingStrategy.prototype, Symbol.toStringTag, {
			value: "CountQueuingStrategy",
			configurable: true
		});
		function countBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
		}
		function IsCountQueuingStrategy(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_countQueuingStrategyHighWaterMark")) return false;
			return x$1 instanceof CountQueuingStrategy;
		}
		function convertTransformer(original, context) {
			assertDictionary(original, context);
			const cancel = original === null || original === void 0 ? void 0 : original.cancel;
			const flush = original === null || original === void 0 ? void 0 : original.flush;
			const readableType = original === null || original === void 0 ? void 0 : original.readableType;
			const start = original === null || original === void 0 ? void 0 : original.start;
			const transform = original === null || original === void 0 ? void 0 : original.transform;
			const writableType = original === null || original === void 0 ? void 0 : original.writableType;
			return {
				cancel: cancel === void 0 ? void 0 : convertTransformerCancelCallback(cancel, original, `${context} has member 'cancel' that`),
				flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
				readableType,
				start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
				transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
				writableType
			};
		}
		function convertTransformerFlushCallback(fn, original, context) {
			assertFunction(fn, context);
			return (controller) => promiseCall(fn, original, [controller]);
		}
		function convertTransformerStartCallback(fn, original, context) {
			assertFunction(fn, context);
			return (controller) => reflectCall(fn, original, [controller]);
		}
		function convertTransformerTransformCallback(fn, original, context) {
			assertFunction(fn, context);
			return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
		}
		function convertTransformerCancelCallback(fn, original, context) {
			assertFunction(fn, context);
			return (reason) => promiseCall(fn, original, [reason]);
		}
		/**
		* A transform stream consists of a pair of streams: a {@link WritableStream | writable stream},
		* known as its writable side, and a {@link ReadableStream | readable stream}, known as its readable side.
		* In a manner specific to the transform stream in question, writes to the writable side result in new data being
		* made available for reading from the readable side.
		*
		* @public
		*/
		class TransformStream {
			constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
				if (rawTransformer === void 0) rawTransformer = null;
				const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
				const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
				const transformer = convertTransformer(rawTransformer, "First parameter");
				if (transformer.readableType !== void 0) throw new RangeError("Invalid readableType specified");
				if (transformer.writableType !== void 0) throw new RangeError("Invalid writableType specified");
				const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
				const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
				const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
				const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
				let startPromise_resolve;
				const startPromise = newPromise((resolve) => {
					startPromise_resolve = resolve;
				});
				InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
				SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
				if (transformer.start !== void 0) startPromise_resolve(transformer.start(this._transformStreamController));
				else startPromise_resolve(void 0);
			}
			/**
			* The readable side of the transform stream.
			*/
			get readable() {
				if (!IsTransformStream(this)) throw streamBrandCheckException("readable");
				return this._readable;
			}
			/**
			* The writable side of the transform stream.
			*/
			get writable() {
				if (!IsTransformStream(this)) throw streamBrandCheckException("writable");
				return this._writable;
			}
		}
		Object.defineProperties(TransformStream.prototype, {
			readable: { enumerable: true },
			writable: { enumerable: true }
		});
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(TransformStream.prototype, Symbol.toStringTag, {
			value: "TransformStream",
			configurable: true
		});
		function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
			function startAlgorithm() {
				return startPromise;
			}
			function writeAlgorithm(chunk) {
				return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
			}
			function abortAlgorithm(reason) {
				return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
			}
			function closeAlgorithm() {
				return TransformStreamDefaultSinkCloseAlgorithm(stream);
			}
			stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
			function pullAlgorithm() {
				return TransformStreamDefaultSourcePullAlgorithm(stream);
			}
			function cancelAlgorithm(reason) {
				return TransformStreamDefaultSourceCancelAlgorithm(stream, reason);
			}
			stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
			stream._backpressure = void 0;
			stream._backpressureChangePromise = void 0;
			stream._backpressureChangePromise_resolve = void 0;
			TransformStreamSetBackpressure(stream, true);
			stream._transformStreamController = void 0;
		}
		function IsTransformStream(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_transformStreamController")) return false;
			return x$1 instanceof TransformStream;
		}
		function TransformStreamError(stream, e$1) {
			ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e$1);
			TransformStreamErrorWritableAndUnblockWrite(stream, e$1);
		}
		function TransformStreamErrorWritableAndUnblockWrite(stream, e$1) {
			TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
			WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e$1);
			TransformStreamUnblockWrite(stream);
		}
		function TransformStreamUnblockWrite(stream) {
			if (stream._backpressure) TransformStreamSetBackpressure(stream, false);
		}
		function TransformStreamSetBackpressure(stream, backpressure) {
			if (stream._backpressureChangePromise !== void 0) stream._backpressureChangePromise_resolve();
			stream._backpressureChangePromise = newPromise((resolve) => {
				stream._backpressureChangePromise_resolve = resolve;
			});
			stream._backpressure = backpressure;
		}
		/**
		* Allows control of the {@link ReadableStream} and {@link WritableStream} of the associated {@link TransformStream}.
		*
		* @public
		*/
		class TransformStreamDefaultController {
			constructor() {
				throw new TypeError("Illegal constructor");
			}
			/**
			* Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
			*/
			get desiredSize() {
				if (!IsTransformStreamDefaultController(this)) throw defaultControllerBrandCheckException("desiredSize");
				const readableController = this._controlledTransformStream._readable._readableStreamController;
				return ReadableStreamDefaultControllerGetDesiredSize(readableController);
			}
			enqueue(chunk = void 0) {
				if (!IsTransformStreamDefaultController(this)) throw defaultControllerBrandCheckException("enqueue");
				TransformStreamDefaultControllerEnqueue(this, chunk);
			}
			/**
			* Errors both the readable side and the writable side of the controlled transform stream, making all future
			* interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
			*/
			error(reason = void 0) {
				if (!IsTransformStreamDefaultController(this)) throw defaultControllerBrandCheckException("error");
				TransformStreamDefaultControllerError(this, reason);
			}
			/**
			* Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
			* transformer only needs to consume a portion of the chunks written to the writable side.
			*/
			terminate() {
				if (!IsTransformStreamDefaultController(this)) throw defaultControllerBrandCheckException("terminate");
				TransformStreamDefaultControllerTerminate(this);
			}
		}
		Object.defineProperties(TransformStreamDefaultController.prototype, {
			enqueue: { enumerable: true },
			error: { enumerable: true },
			terminate: { enumerable: true },
			desiredSize: { enumerable: true }
		});
		setFunctionName(TransformStreamDefaultController.prototype.enqueue, "enqueue");
		setFunctionName(TransformStreamDefaultController.prototype.error, "error");
		setFunctionName(TransformStreamDefaultController.prototype.terminate, "terminate");
		if (typeof Symbol.toStringTag === "symbol") Object.defineProperty(TransformStreamDefaultController.prototype, Symbol.toStringTag, {
			value: "TransformStreamDefaultController",
			configurable: true
		});
		function IsTransformStreamDefaultController(x$1) {
			if (!typeIsObject(x$1)) return false;
			if (!Object.prototype.hasOwnProperty.call(x$1, "_controlledTransformStream")) return false;
			return x$1 instanceof TransformStreamDefaultController;
		}
		function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm) {
			controller._controlledTransformStream = stream;
			stream._transformStreamController = controller;
			controller._transformAlgorithm = transformAlgorithm;
			controller._flushAlgorithm = flushAlgorithm;
			controller._cancelAlgorithm = cancelAlgorithm;
			controller._finishPromise = void 0;
			controller._finishPromise_resolve = void 0;
			controller._finishPromise_reject = void 0;
		}
		function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
			const controller = Object.create(TransformStreamDefaultController.prototype);
			let transformAlgorithm;
			let flushAlgorithm;
			let cancelAlgorithm;
			if (transformer.transform !== void 0) transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
			else transformAlgorithm = (chunk) => {
				try {
					TransformStreamDefaultControllerEnqueue(controller, chunk);
					return promiseResolvedWith(void 0);
				} catch (transformResultE) {
					return promiseRejectedWith(transformResultE);
				}
			};
			if (transformer.flush !== void 0) flushAlgorithm = () => transformer.flush(controller);
			else flushAlgorithm = () => promiseResolvedWith(void 0);
			if (transformer.cancel !== void 0) cancelAlgorithm = (reason) => transformer.cancel(reason);
			else cancelAlgorithm = () => promiseResolvedWith(void 0);
			SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm);
		}
		function TransformStreamDefaultControllerClearAlgorithms(controller) {
			controller._transformAlgorithm = void 0;
			controller._flushAlgorithm = void 0;
			controller._cancelAlgorithm = void 0;
		}
		function TransformStreamDefaultControllerEnqueue(controller, chunk) {
			const stream = controller._controlledTransformStream;
			const readableController = stream._readable._readableStreamController;
			if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) throw new TypeError("Readable side is not in a state that permits enqueue");
			try {
				ReadableStreamDefaultControllerEnqueue(readableController, chunk);
			} catch (e$1) {
				TransformStreamErrorWritableAndUnblockWrite(stream, e$1);
				throw stream._readable._storedError;
			}
			if (ReadableStreamDefaultControllerHasBackpressure(readableController) !== stream._backpressure) TransformStreamSetBackpressure(stream, true);
		}
		function TransformStreamDefaultControllerError(controller, e$1) {
			TransformStreamError(controller._controlledTransformStream, e$1);
		}
		function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
			return transformPromiseWith(controller._transformAlgorithm(chunk), void 0, (r$1) => {
				TransformStreamError(controller._controlledTransformStream, r$1);
				throw r$1;
			});
		}
		function TransformStreamDefaultControllerTerminate(controller) {
			const stream = controller._controlledTransformStream;
			const readableController = stream._readable._readableStreamController;
			ReadableStreamDefaultControllerClose(readableController);
			TransformStreamErrorWritableAndUnblockWrite(stream, /* @__PURE__ */ new TypeError("TransformStream terminated"));
		}
		function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
			const controller = stream._transformStreamController;
			if (stream._backpressure) {
				const backpressureChangePromise = stream._backpressureChangePromise;
				return transformPromiseWith(backpressureChangePromise, () => {
					const writable = stream._writable;
					if (writable._state === "erroring") throw writable._storedError;
					return TransformStreamDefaultControllerPerformTransform(controller, chunk);
				});
			}
			return TransformStreamDefaultControllerPerformTransform(controller, chunk);
		}
		function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
			const controller = stream._transformStreamController;
			if (controller._finishPromise !== void 0) return controller._finishPromise;
			const readable = stream._readable;
			controller._finishPromise = newPromise((resolve, reject) => {
				controller._finishPromise_resolve = resolve;
				controller._finishPromise_reject = reject;
			});
			const cancelPromise = controller._cancelAlgorithm(reason);
			TransformStreamDefaultControllerClearAlgorithms(controller);
			uponPromise(cancelPromise, () => {
				if (readable._state === "errored") defaultControllerFinishPromiseReject(controller, readable._storedError);
				else {
					ReadableStreamDefaultControllerError(readable._readableStreamController, reason);
					defaultControllerFinishPromiseResolve(controller);
				}
				return null;
			}, (r$1) => {
				ReadableStreamDefaultControllerError(readable._readableStreamController, r$1);
				defaultControllerFinishPromiseReject(controller, r$1);
				return null;
			});
			return controller._finishPromise;
		}
		function TransformStreamDefaultSinkCloseAlgorithm(stream) {
			const controller = stream._transformStreamController;
			if (controller._finishPromise !== void 0) return controller._finishPromise;
			const readable = stream._readable;
			controller._finishPromise = newPromise((resolve, reject) => {
				controller._finishPromise_resolve = resolve;
				controller._finishPromise_reject = reject;
			});
			const flushPromise = controller._flushAlgorithm();
			TransformStreamDefaultControllerClearAlgorithms(controller);
			uponPromise(flushPromise, () => {
				if (readable._state === "errored") defaultControllerFinishPromiseReject(controller, readable._storedError);
				else {
					ReadableStreamDefaultControllerClose(readable._readableStreamController);
					defaultControllerFinishPromiseResolve(controller);
				}
				return null;
			}, (r$1) => {
				ReadableStreamDefaultControllerError(readable._readableStreamController, r$1);
				defaultControllerFinishPromiseReject(controller, r$1);
				return null;
			});
			return controller._finishPromise;
		}
		function TransformStreamDefaultSourcePullAlgorithm(stream) {
			TransformStreamSetBackpressure(stream, false);
			return stream._backpressureChangePromise;
		}
		function TransformStreamDefaultSourceCancelAlgorithm(stream, reason) {
			const controller = stream._transformStreamController;
			if (controller._finishPromise !== void 0) return controller._finishPromise;
			const writable = stream._writable;
			controller._finishPromise = newPromise((resolve, reject) => {
				controller._finishPromise_resolve = resolve;
				controller._finishPromise_reject = reject;
			});
			const cancelPromise = controller._cancelAlgorithm(reason);
			TransformStreamDefaultControllerClearAlgorithms(controller);
			uponPromise(cancelPromise, () => {
				if (writable._state === "errored") defaultControllerFinishPromiseReject(controller, writable._storedError);
				else {
					WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, reason);
					TransformStreamUnblockWrite(stream);
					defaultControllerFinishPromiseResolve(controller);
				}
				return null;
			}, (r$1) => {
				WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, r$1);
				TransformStreamUnblockWrite(stream);
				defaultControllerFinishPromiseReject(controller, r$1);
				return null;
			});
			return controller._finishPromise;
		}
		function defaultControllerBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
		}
		function defaultControllerFinishPromiseResolve(controller) {
			if (controller._finishPromise_resolve === void 0) return;
			controller._finishPromise_resolve();
			controller._finishPromise_resolve = void 0;
			controller._finishPromise_reject = void 0;
		}
		function defaultControllerFinishPromiseReject(controller, reason) {
			if (controller._finishPromise_reject === void 0) return;
			setPromiseIsHandledToTrue(controller._finishPromise);
			controller._finishPromise_reject(reason);
			controller._finishPromise_resolve = void 0;
			controller._finishPromise_reject = void 0;
		}
		function streamBrandCheckException(name) {
			return /* @__PURE__ */ new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
		}
		exports$1.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
		exports$1.CountQueuingStrategy = CountQueuingStrategy;
		exports$1.ReadableByteStreamController = ReadableByteStreamController;
		exports$1.ReadableStream = ReadableStream$1;
		exports$1.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
		exports$1.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
		exports$1.ReadableStreamDefaultController = ReadableStreamDefaultController;
		exports$1.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
		exports$1.TransformStream = TransformStream;
		exports$1.TransformStreamDefaultController = TransformStreamDefaultController;
		exports$1.WritableStream = WritableStream;
		exports$1.WritableStreamDefaultController = WritableStreamDefaultController;
		exports$1.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
	}));
}));

//#endregion
//#region ../node_modules/.pnpm/fetch-blob@3.2.0/node_modules/fetch-blob/streams.cjs
var require_streams = /* @__PURE__ */ require_chunk.__commonJSMin((() => {
	/* c8 ignore start */
	const POOL_SIZE = 65536;
	if (!globalThis.ReadableStream) try {
		const process$1 = require("node:process");
		const { emitWarning } = process$1;
		try {
			process$1.emitWarning = () => {};
			Object.assign(globalThis, require("node:stream/web"));
			process$1.emitWarning = emitWarning;
		} catch (error) {
			process$1.emitWarning = emitWarning;
			throw error;
		}
	} catch (error) {
		Object.assign(globalThis, require_ponyfill_es2018());
	}
	try {
		const { Blob: Blob$1 } = require("buffer");
		if (Blob$1 && !Blob$1.prototype.stream) Blob$1.prototype.stream = function name(params) {
			let position = 0;
			const blob = this;
			return new ReadableStream({
				type: "bytes",
				async pull(ctrl) {
					const buffer = await blob.slice(position, Math.min(blob.size, position + POOL_SIZE)).arrayBuffer();
					position += buffer.byteLength;
					ctrl.enqueue(new Uint8Array(buffer));
					if (position === blob.size) ctrl.close();
				}
			});
		};
	} catch (error) {}
}));
/* c8 ignore end */

//#endregion
//#region ../node_modules/.pnpm/fetch-blob@3.2.0/node_modules/fetch-blob/index.js
var import_streams = require_streams();
const POOL_SIZE = 65536;
/** @param {(Blob | Uint8Array)[]} parts */
async function* toIterator(parts, clone = true) {
	for (const part of parts) if ("stream" in part) yield* part.stream();
	else if (ArrayBuffer.isView(part)) if (clone) {
		let position = part.byteOffset;
		const end = part.byteOffset + part.byteLength;
		while (position !== end) {
			const size = Math.min(end - position, POOL_SIZE);
			const chunk = part.buffer.slice(position, position + size);
			position += chunk.byteLength;
			yield new Uint8Array(chunk);
		}
	} else yield part;
	else {
		let position = 0, b = part;
		while (position !== b.size) {
			const buffer = await b.slice(position, Math.min(b.size, position + POOL_SIZE)).arrayBuffer();
			position += buffer.byteLength;
			yield new Uint8Array(buffer);
		}
	}
}
const _Blob = class Blob$1 {
	/** @type {Array.<(Blob|Uint8Array)>} */
	#parts = [];
	#type = "";
	#size = 0;
	#endings = "transparent";
	/**
	* The Blob() constructor returns a new Blob object. The content
	* of the blob consists of the concatenation of the values given
	* in the parameter array.
	*
	* @param {*} blobParts
	* @param {{ type?: string, endings?: string }} [options]
	*/
	constructor(blobParts = [], options = {}) {
		if (typeof blobParts !== "object" || blobParts === null) throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
		if (typeof blobParts[Symbol.iterator] !== "function") throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
		if (typeof options !== "object" && typeof options !== "function") throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
		if (options === null) options = {};
		const encoder = new TextEncoder();
		for (const element of blobParts) {
			let part;
			if (ArrayBuffer.isView(element)) part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
			else if (element instanceof ArrayBuffer) part = new Uint8Array(element.slice(0));
			else if (element instanceof Blob$1) part = element;
			else part = encoder.encode(`${element}`);
			this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
			this.#parts.push(part);
		}
		this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
		const type = options.type === void 0 ? "" : String(options.type);
		this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
	}
	/**
	* The Blob interface's size property returns the
	* size of the Blob in bytes.
	*/
	get size() {
		return this.#size;
	}
	/**
	* The type property of a Blob object returns the MIME type of the file.
	*/
	get type() {
		return this.#type;
	}
	/**
	* The text() method in the Blob interface returns a Promise
	* that resolves with a string containing the contents of
	* the blob, interpreted as UTF-8.
	*
	* @return {Promise<string>}
	*/
	async text() {
		const decoder = new TextDecoder();
		let str = "";
		for await (const part of toIterator(this.#parts, false)) str += decoder.decode(part, { stream: true });
		str += decoder.decode();
		return str;
	}
	/**
	* The arrayBuffer() method in the Blob interface returns a
	* Promise that resolves with the contents of the blob as
	* binary data contained in an ArrayBuffer.
	*
	* @return {Promise<ArrayBuffer>}
	*/
	async arrayBuffer() {
		const data = new Uint8Array(this.size);
		let offset = 0;
		for await (const chunk of toIterator(this.#parts, false)) {
			data.set(chunk, offset);
			offset += chunk.length;
		}
		return data.buffer;
	}
	stream() {
		const it = toIterator(this.#parts, true);
		return new globalThis.ReadableStream({
			type: "bytes",
			async pull(ctrl) {
				const chunk = await it.next();
				chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
			},
			async cancel() {
				await it.return();
			}
		});
	}
	/**
	* The Blob interface's slice() method creates and returns a
	* new Blob object which contains data from a subset of the
	* blob on which it's called.
	*
	* @param {number} [start]
	* @param {number} [end]
	* @param {string} [type]
	*/
	slice(start = 0, end = this.size, type = "") {
		const { size } = this;
		let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
		let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
		const span = Math.max(relativeEnd - relativeStart, 0);
		const parts = this.#parts;
		const blobParts = [];
		let added = 0;
		for (const part of parts) {
			if (added >= span) break;
			const size$1 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
			if (relativeStart && size$1 <= relativeStart) {
				relativeStart -= size$1;
				relativeEnd -= size$1;
			} else {
				let chunk;
				if (ArrayBuffer.isView(part)) {
					chunk = part.subarray(relativeStart, Math.min(size$1, relativeEnd));
					added += chunk.byteLength;
				} else {
					chunk = part.slice(relativeStart, Math.min(size$1, relativeEnd));
					added += chunk.size;
				}
				relativeEnd -= size$1;
				blobParts.push(chunk);
				relativeStart = 0;
			}
		}
		const blob = new Blob$1([], { type: String(type).toLowerCase() });
		blob.#size = span;
		blob.#parts = blobParts;
		return blob;
	}
	get [Symbol.toStringTag]() {
		return "Blob";
	}
	static [Symbol.hasInstance](object) {
		return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
	}
};
Object.defineProperties(_Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});
/** @type {typeof globalThis.Blob} */
const Blob = _Blob;
var fetch_blob_default = Blob;

//#endregion
//#region ../node_modules/.pnpm/fetch-blob@3.2.0/node_modules/fetch-blob/file.js
const _File = class File$1 extends fetch_blob_default {
	#lastModified = 0;
	#name = "";
	/**
	* @param {*[]} fileBits
	* @param {string} fileName
	* @param {{lastModified?: number, type?: string}} options
	*/ constructor(fileBits, fileName, options = {}) {
		if (arguments.length < 2) throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
		super(fileBits, options);
		if (options === null) options = {};
		const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
		if (!Number.isNaN(lastModified)) this.#lastModified = lastModified;
		this.#name = String(fileName);
	}
	get name() {
		return this.#name;
	}
	get lastModified() {
		return this.#lastModified;
	}
	get [Symbol.toStringTag]() {
		return "File";
	}
	static [Symbol.hasInstance](object) {
		return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
	}
};
/** @type {typeof globalThis.File} */ const File = _File;
var file_default = File;

//#endregion
//#region ../node_modules/.pnpm/formdata-polyfill@4.0.10/node_modules/formdata-polyfill/esm.min.js
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: t, iterator: i, hasInstance: h } = Symbol, r = Math.random, m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new file_default([b], c, b) : b] : [a, b + ""]), e = (c, f$1) => (f$1 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), x = (n, a, e$1) => {
	if (a.length < e$1) throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e$1} arguments required, but only ${a.length} present.`);
};
/** @type {typeof globalThis.FormData} */
const FormData = class FormData$1 {
	#d = [];
	constructor(...a) {
		if (a.length) throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
	}
	get [t]() {
		return "FormData";
	}
	[i]() {
		return this.entries();
	}
	static [h](o) {
		return o && typeof o === "object" && o[t] === "FormData" && !m.some((m$1) => typeof o[m$1] != "function");
	}
	append(...a) {
		x("append", arguments, 2);
		this.#d.push(f(...a));
	}
	delete(a) {
		x("delete", arguments, 1);
		a += "";
		this.#d = this.#d.filter(([b]) => b !== a);
	}
	get(a) {
		x("get", arguments, 1);
		a += "";
		for (var b = this.#d, l = b.length, c = 0; c < l; c++) if (b[c][0] === a) return b[c][1];
		return null;
	}
	getAll(a, b) {
		x("getAll", arguments, 1);
		b = [];
		a += "";
		this.#d.forEach((c) => c[0] === a && b.push(c[1]));
		return b;
	}
	has(a) {
		x("has", arguments, 1);
		a += "";
		return this.#d.some((b) => b[0] === a);
	}
	forEach(a, b) {
		x("forEach", arguments, 1);
		for (var [c, d] of this) a.call(b, d, c, this);
	}
	set(...a) {
		x("set", arguments, 2);
		var b = [], c = !0;
		a = f(...a);
		this.#d.forEach((d) => {
			d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
		});
		c && b.push(a);
		this.#d = b;
	}
	*entries() {
		yield* this.#d;
	}
	*keys() {
		for (var [a] of this) yield a;
	}
	*values() {
		for (var [, a] of this) yield a;
	}
};
/** @param {FormData} F */
function formDataToBlob(F, B = fetch_blob_default) {
	var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r\nContent-Disposition: form-data; name="`;
	F.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r\n\r\n${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r\n`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r\nContent-Type: ${v.type || "application/octet-stream"}\r\n\r\n`, v, "\r\n"));
	c.push(`--${b}--`);
	return new B(c, { type: "multipart/form-data; boundary=" + b });
}

//#endregion
//#region ../node_modules/.pnpm/node-domexception@1.0.0/node_modules/node-domexception/index.js
var require_node_domexception = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
	if (!globalThis.DOMException) try {
		const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = /* @__PURE__ */ new ArrayBuffer();
		port.postMessage(ab, [ab, ab]);
	} catch (err) {
		err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
	}
	module.exports = globalThis.DOMException;
}));

//#endregion
//#region ../node_modules/.pnpm/fetch-blob@3.2.0/node_modules/fetch-blob/from.js
var import_node_domexception = /* @__PURE__ */ require_chunk.__toESM(require_node_domexception(), 1);
const { stat } = node_fs.promises;
/**
* This is a blob backed up by a file on the disk
* with minium requirement. Its wrapped around a Blob as a blobPart
* so you have no direct access to this.
*
* @private
*/
var BlobDataItem = class BlobDataItem {
	#path;
	#start;
	constructor(options) {
		this.#path = options.path;
		this.#start = options.start;
		this.size = options.size;
		this.lastModified = options.lastModified;
	}
	/**
	* Slicing arguments is first validated and formatted
	* to not be out of range by Blob.prototype.slice
	*/
	slice(start, end) {
		return new BlobDataItem({
			path: this.#path,
			lastModified: this.lastModified,
			size: end - start,
			start: this.#start + start
		});
	}
	async *stream() {
		const { mtimeMs } = await stat(this.#path);
		if (mtimeMs > this.lastModified) throw new import_node_domexception.default("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
		yield* (0, node_fs.createReadStream)(this.#path, {
			start: this.#start,
			end: this.#start + this.size - 1
		});
	}
	get [Symbol.toStringTag]() {
		return "Blob";
	}
};

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-login@3.940.0/node_modules/@aws-sdk/credential-provider-login/dist-cjs/index.js
var require_dist_cjs$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var client = (require_client.init_client(), require_chunk.__toCommonJS(require_client.client_exports));
	var propertyProvider = require_dist_cjs$6.require_dist_cjs();
	var sharedIniFileLoader = require_dist_cjs$7.require_dist_cjs();
	var protocolHttp = require_dist_cjs$5.require_dist_cjs();
	var node_crypto = require("node:crypto");
	var node_fs$1 = require("node:fs");
	var node_os = require("node:os");
	var node_path$1 = require("node:path");
	var LoginCredentialsFetcher = class LoginCredentialsFetcher {
		profileData;
		init;
		callerClientConfig;
		static REFRESH_THRESHOLD = 300 * 1e3;
		constructor(profileData, init, callerClientConfig) {
			this.profileData = profileData;
			this.init = init;
			this.callerClientConfig = callerClientConfig;
		}
		async loadCredentials() {
			const token = await this.loadToken();
			if (!token) throw new propertyProvider.CredentialsProviderError(`Failed to load a token for session ${this.loginSession}, please re-authenticate using aws login`, {
				tryNextLink: false,
				logger: this.logger
			});
			const accessToken = token.accessToken;
			const now = Date.now();
			if (new Date(accessToken.expiresAt).getTime() - now <= LoginCredentialsFetcher.REFRESH_THRESHOLD) return this.refresh(token);
			return {
				accessKeyId: accessToken.accessKeyId,
				secretAccessKey: accessToken.secretAccessKey,
				sessionToken: accessToken.sessionToken,
				accountId: accessToken.accountId,
				expiration: new Date(accessToken.expiresAt)
			};
		}
		get logger() {
			return this.init?.logger;
		}
		get loginSession() {
			return this.profileData.login_session;
		}
		async refresh(token) {
			const { SigninClient, CreateOAuth2TokenCommand } = await Promise.resolve().then(() => require("./signin-CC7OIM_f.js"));
			const { logger, userAgentAppId } = this.callerClientConfig ?? {};
			const isH2 = (requestHandler$1) => {
				return requestHandler$1?.metadata?.handlerProtocol === "h2";
			};
			const requestHandler = isH2(this.callerClientConfig?.requestHandler) ? void 0 : this.callerClientConfig?.requestHandler;
			const client = new SigninClient({
				credentials: {
					accessKeyId: "",
					secretAccessKey: ""
				},
				region: this.profileData.region ?? await this.callerClientConfig?.region?.() ?? process.env.AWS_REGION,
				requestHandler,
				logger,
				userAgentAppId,
				...this.init?.clientConfig
			});
			this.createDPoPInterceptor(client.middlewareStack);
			const commandInput = { tokenInput: {
				clientId: token.clientId,
				refreshToken: token.refreshToken,
				grantType: "refresh_token"
			} };
			try {
				const response = await client.send(new CreateOAuth2TokenCommand(commandInput));
				const { accessKeyId, secretAccessKey, sessionToken } = response.tokenOutput?.accessToken ?? {};
				const { refreshToken, expiresIn } = response.tokenOutput ?? {};
				if (!accessKeyId || !secretAccessKey || !sessionToken || !refreshToken) throw new propertyProvider.CredentialsProviderError("Token refresh response missing required fields", {
					logger: this.logger,
					tryNextLink: false
				});
				const expiresInMs = (expiresIn ?? 900) * 1e3;
				const expiration = new Date(Date.now() + expiresInMs);
				const updatedToken = {
					...token,
					accessToken: {
						...token.accessToken,
						accessKeyId,
						secretAccessKey,
						sessionToken,
						expiresAt: expiration.toISOString()
					},
					refreshToken
				};
				await this.saveToken(updatedToken);
				const newAccessToken = updatedToken.accessToken;
				return {
					accessKeyId: newAccessToken.accessKeyId,
					secretAccessKey: newAccessToken.secretAccessKey,
					sessionToken: newAccessToken.sessionToken,
					accountId: newAccessToken.accountId,
					expiration
				};
			} catch (error) {
				if (error.name === "AccessDeniedException") {
					const errorType = error.error;
					let message;
					switch (errorType) {
						case "TOKEN_EXPIRED":
							message = "Your session has expired. Please reauthenticate.";
							break;
						case "USER_CREDENTIALS_CHANGED":
							message = "Unable to refresh credentials because of a change in your password. Please reauthenticate with your new password.";
							break;
						case "INSUFFICIENT_PERMISSIONS":
							message = "Unable to refresh credentials due to insufficient permissions. You may be missing permission for the 'CreateOAuth2Token' action.";
							break;
						default: message = `Failed to refresh token: ${String(error)}. Please re-authenticate using \`aws login\``;
					}
					throw new propertyProvider.CredentialsProviderError(message, {
						logger: this.logger,
						tryNextLink: false
					});
				}
				throw new propertyProvider.CredentialsProviderError(`Failed to refresh token: ${String(error)}. Please re-authenticate using aws login`, { logger: this.logger });
			}
		}
		async loadToken() {
			const tokenFilePath = this.getTokenFilePath();
			try {
				let tokenData;
				try {
					tokenData = await sharedIniFileLoader.readFile(tokenFilePath, { ignoreCache: this.init?.ignoreCache });
				} catch {
					tokenData = await node_fs$1.promises.readFile(tokenFilePath, "utf8");
				}
				const token = JSON.parse(tokenData);
				const missingFields = [
					"accessToken",
					"clientId",
					"refreshToken",
					"dpopKey"
				].filter((k) => !token[k]);
				if (!token.accessToken?.accountId) missingFields.push("accountId");
				if (missingFields.length > 0) throw new propertyProvider.CredentialsProviderError(`Token validation failed, missing fields: ${missingFields.join(", ")}`, {
					logger: this.logger,
					tryNextLink: false
				});
				return token;
			} catch (error) {
				throw new propertyProvider.CredentialsProviderError(`Failed to load token from ${tokenFilePath}: ${String(error)}`, {
					logger: this.logger,
					tryNextLink: false
				});
			}
		}
		async saveToken(token) {
			const tokenFilePath = this.getTokenFilePath();
			const directory = node_path$1.dirname(tokenFilePath);
			try {
				await node_fs$1.promises.mkdir(directory, { recursive: true });
			} catch (error) {}
			await node_fs$1.promises.writeFile(tokenFilePath, JSON.stringify(token, null, 2), "utf8");
		}
		getTokenFilePath() {
			const directory = process.env.AWS_LOGIN_CACHE_DIRECTORY ?? node_path$1.join(node_os.homedir(), ".aws", "login", "cache");
			const loginSessionBytes = Buffer.from(this.loginSession, "utf8");
			const loginSessionSha256 = node_crypto.createHash("sha256").update(loginSessionBytes).digest("hex");
			return node_path$1.join(directory, `${loginSessionSha256}.json`);
		}
		derToRawSignature(derSignature) {
			let offset = 2;
			if (derSignature[offset] !== 2) throw new Error("Invalid DER signature");
			offset++;
			const rLength = derSignature[offset++];
			let r$1 = derSignature.subarray(offset, offset + rLength);
			offset += rLength;
			if (derSignature[offset] !== 2) throw new Error("Invalid DER signature");
			offset++;
			const sLength = derSignature[offset++];
			let s = derSignature.subarray(offset, offset + sLength);
			r$1 = r$1[0] === 0 ? r$1.subarray(1) : r$1;
			s = s[0] === 0 ? s.subarray(1) : s;
			const rPadded = Buffer.concat([Buffer.alloc(32 - r$1.length), r$1]);
			const sPadded = Buffer.concat([Buffer.alloc(32 - s.length), s]);
			return Buffer.concat([rPadded, sPadded]);
		}
		createDPoPInterceptor(middlewareStack) {
			middlewareStack.add((next) => async (args) => {
				if (protocolHttp.HttpRequest.isInstance(args.request)) {
					const request = args.request;
					const actualEndpoint = `${request.protocol}//${request.hostname}${request.port ? `:${request.port}` : ""}${request.path}`;
					const dpop = await this.generateDpop(request.method, actualEndpoint);
					request.headers = {
						...request.headers,
						DPoP: dpop
					};
				}
				return next(args);
			}, {
				step: "finalizeRequest",
				name: "dpopInterceptor",
				override: true
			});
		}
		async generateDpop(method = "POST", endpoint) {
			const token = await this.loadToken();
			try {
				const privateKey = node_crypto.createPrivateKey({
					key: token.dpopKey,
					format: "pem",
					type: "sec1"
				});
				const publicDer = node_crypto.createPublicKey(privateKey).export({
					format: "der",
					type: "spki"
				});
				let pointStart = -1;
				for (let i$1 = 0; i$1 < publicDer.length; i$1++) if (publicDer[i$1] === 4) {
					pointStart = i$1;
					break;
				}
				const x$1 = publicDer.slice(pointStart + 1, pointStart + 33);
				const y = publicDer.slice(pointStart + 33, pointStart + 65);
				const header = {
					alg: "ES256",
					typ: "dpop+jwt",
					jwk: {
						kty: "EC",
						crv: "P-256",
						x: x$1.toString("base64url"),
						y: y.toString("base64url")
					}
				};
				const payload = {
					jti: crypto.randomUUID(),
					htm: method,
					htu: endpoint,
					iat: Math.floor(Date.now() / 1e3)
				};
				const message = `${Buffer.from(JSON.stringify(header)).toString("base64url")}.${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
				const asn1Signature = node_crypto.sign("sha256", Buffer.from(message), privateKey);
				return `${message}.${this.derToRawSignature(asn1Signature).toString("base64url")}`;
			} catch (error) {
				throw new propertyProvider.CredentialsProviderError(`Failed to generate Dpop proof: ${error instanceof Error ? error.message : String(error)}`, {
					logger: this.logger,
					tryNextLink: false
				});
			}
		}
	};
	const fromLoginCredentials = (init) => async ({ callerClientConfig } = {}) => {
		init?.logger?.debug?.("@aws-sdk/credential-providers - fromLoginCredentials");
		const profiles = await sharedIniFileLoader.parseKnownFiles(init || {});
		const profileName = sharedIniFileLoader.getProfileName({ profile: init?.profile ?? callerClientConfig?.profile });
		const profile = profiles[profileName];
		if (!profile?.login_session) throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} does not contain login_session.`, {
			tryNextLink: true,
			logger: init?.logger
		});
		const credentials = await new LoginCredentialsFetcher(profile, init, callerClientConfig).loadCredentials();
		return client.setCredentialFeature(credentials, "CREDENTIALS_LOGIN", "AD");
	};
	exports.fromLoginCredentials = fromLoginCredentials;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.940.0/node_modules/@aws-sdk/credential-provider-ini/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var sharedIniFileLoader = require_dist_cjs$7.require_dist_cjs();
	var propertyProvider = require_dist_cjs$6.require_dist_cjs();
	var client = (require_client.init_client(), require_chunk.__toCommonJS(require_client.client_exports));
	var credentialProviderLogin = require_dist_cjs$1();
	const resolveCredentialSource = (credentialSource, profileName, logger) => {
		const sourceProvidersMap = {
			EcsContainer: async (options) => {
				const { fromHttp } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-BI-lCTto.js")));
				const { fromContainerMetadata } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-Blt4Z-vU.js")));
				logger?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer");
				return async () => propertyProvider.chain(fromHttp(options ?? {}), fromContainerMetadata(options))().then(setNamedProvider);
			},
			Ec2InstanceMetadata: async (options) => {
				logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
				const { fromInstanceMetadata } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-Blt4Z-vU.js")));
				return async () => fromInstanceMetadata(options)().then(setNamedProvider);
			},
			Environment: async (options) => {
				logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
				const { fromEnv } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-EcptzQBw.js")));
				return async () => fromEnv(options)().then(setNamedProvider);
			}
		};
		if (credentialSource in sourceProvidersMap) return sourceProvidersMap[credentialSource];
		else throw new propertyProvider.CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, { logger });
	};
	const setNamedProvider = (creds) => client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p");
	const isAssumeRoleProfile = (arg, { profile = "default", logger } = {}) => {
		return Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg, {
			profile,
			logger
		}) || isCredentialSourceProfile(arg, {
			profile,
			logger
		}));
	};
	const isAssumeRoleWithSourceProfile = (arg, { profile, logger }) => {
		const withSourceProfile = typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
		if (withSourceProfile) logger?.debug?.(`    ${profile} isAssumeRoleWithSourceProfile source_profile=${arg.source_profile}`);
		return withSourceProfile;
	};
	const isCredentialSourceProfile = (arg, { profile, logger }) => {
		const withProviderProfile = typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
		if (withProviderProfile) logger?.debug?.(`    ${profile} isCredentialSourceProfile credential_source=${arg.credential_source}`);
		return withProviderProfile;
	};
	const resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}, resolveProfileData) => {
		options.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
		const profileData = profiles[profileName];
		const { source_profile, region } = profileData;
		if (!options.roleAssumer) {
			const { getDefaultRoleAssumer } = await Promise.resolve().then(() => require("./sts-DKrc-wsf.js"));
			options.roleAssumer = getDefaultRoleAssumer({
				...options.clientConfig,
				credentialProviderLogger: options.logger,
				parentClientConfig: {
					...options?.parentClientConfig,
					region: region ?? options?.parentClientConfig?.region
				}
			}, options.clientPlugins);
		}
		if (source_profile && source_profile in visitedProfiles) throw new propertyProvider.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${sharedIniFileLoader.getProfileName(options)}. Profiles visited: ` + Object.keys(visitedProfiles).join(", "), { logger: options.logger });
		options.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${source_profile ? `source_profile=[${source_profile}]` : `profile=[${profileName}]`}`);
		const sourceCredsProvider = source_profile ? resolveProfileData(source_profile, profiles, options, {
			...visitedProfiles,
			[source_profile]: true
		}, isCredentialSourceWithoutRoleArn(profiles[source_profile] ?? {})) : (await resolveCredentialSource(profileData.credential_source, profileName, options.logger)(options))();
		if (isCredentialSourceWithoutRoleArn(profileData)) return sourceCredsProvider.then((creds) => client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
		else {
			const params = {
				RoleArn: profileData.role_arn,
				RoleSessionName: profileData.role_session_name || `aws-sdk-js-${Date.now()}`,
				ExternalId: profileData.external_id,
				DurationSeconds: parseInt(profileData.duration_seconds || "3600", 10)
			};
			const { mfa_serial } = profileData;
			if (mfa_serial) {
				if (!options.mfaCodeProvider) throw new propertyProvider.CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, {
					logger: options.logger,
					tryNextLink: false
				});
				params.SerialNumber = mfa_serial;
				params.TokenCode = await options.mfaCodeProvider(mfa_serial);
			}
			const sourceCreds = await sourceCredsProvider;
			return options.roleAssumer(sourceCreds, params).then((creds) => client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
		}
	};
	const isCredentialSourceWithoutRoleArn = (section) => {
		return !section.role_arn && !!section.credential_source;
	};
	const isLoginProfile = (data) => {
		return Boolean(data && data.login_session);
	};
	const resolveLoginCredentials = async (profileName, options) => {
		const credentials = await credentialProviderLogin.fromLoginCredentials({
			...options,
			profile: profileName
		})();
		return client.setCredentialFeature(credentials, "CREDENTIALS_PROFILE_LOGIN", "AC");
	};
	const isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
	const resolveProcessCredentials = async (options, profile) => Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-sBSaVOtf.js"))).then(({ fromProcess }) => fromProcess({
		...options,
		profile
	})().then((creds) => client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_PROCESS", "v")));
	const resolveSsoCredentials = async (profile, profileData, options = {}) => {
		const { fromSSO } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-CQCc4bni.js")));
		return fromSSO({
			profile,
			logger: options.logger,
			parentClientConfig: options.parentClientConfig,
			clientConfig: options.clientConfig
		})().then((creds) => {
			if (profileData.sso_session) return client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SSO", "r");
			else return client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SSO_LEGACY", "t");
		});
	};
	const isSsoProfile = (arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_session === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string");
	const isStaticCredsProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof arg.aws_account_id) > -1;
	const resolveStaticCredentials = async (profile, options) => {
		options?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
		const credentials = {
			accessKeyId: profile.aws_access_key_id,
			secretAccessKey: profile.aws_secret_access_key,
			sessionToken: profile.aws_session_token,
			...profile.aws_credential_scope && { credentialScope: profile.aws_credential_scope },
			...profile.aws_account_id && { accountId: profile.aws_account_id }
		};
		return client.setCredentialFeature(credentials, "CREDENTIALS_PROFILE", "n");
	};
	const isWebIdentityProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
	const resolveWebIdentityCredentials = async (profile, options) => Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-RfeMj_TG.js"))).then(({ fromTokenFile }) => fromTokenFile({
		webIdentityTokenFile: profile.web_identity_token_file,
		roleArn: profile.role_arn,
		roleSessionName: profile.role_session_name,
		roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
		logger: options.logger,
		parentClientConfig: options.parentClientConfig
	})().then((creds) => client.setCredentialFeature(creds, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q")));
	const resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}, isAssumeRoleRecursiveCall = false) => {
		const data = profiles[profileName];
		if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) return resolveStaticCredentials(data, options);
		if (isAssumeRoleRecursiveCall || isAssumeRoleProfile(data, {
			profile: profileName,
			logger: options.logger
		})) return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles, resolveProfileData);
		if (isStaticCredsProfile(data)) return resolveStaticCredentials(data, options);
		if (isWebIdentityProfile(data)) return resolveWebIdentityCredentials(data, options);
		if (isProcessProfile(data)) return resolveProcessCredentials(options, profileName);
		if (isSsoProfile(data)) return await resolveSsoCredentials(profileName, data, options);
		if (isLoginProfile(data)) return resolveLoginCredentials(profileName, options);
		throw new propertyProvider.CredentialsProviderError(`Could not resolve credentials using profile: [${profileName}] in configuration/credentials file(s).`, { logger: options.logger });
	};
	const fromIni = (_init = {}) => async ({ callerClientConfig } = {}) => {
		const init = {
			..._init,
			parentClientConfig: {
				...callerClientConfig,
				..._init.parentClientConfig
			}
		};
		init.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
		const profiles = await sharedIniFileLoader.parseKnownFiles(init);
		return resolveProfileData(sharedIniFileLoader.getProfileName({ profile: _init.profile ?? callerClientConfig?.profile }), profiles, init);
	};
	exports.fromIni = fromIni;
}));

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_dist_cjs();
  }
});