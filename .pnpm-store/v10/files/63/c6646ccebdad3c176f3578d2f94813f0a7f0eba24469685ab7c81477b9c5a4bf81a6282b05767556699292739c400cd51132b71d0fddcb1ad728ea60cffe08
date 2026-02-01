"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailContext = exports.NoopContext = exports.VError = void 0;
/**
 * Error thrown by validation. Besides an informative message, it includes the path to the
 * property which triggered the failure.
 */
var VError = /** @class */ (function (_super) {
    __extends(VError, _super);
    function VError(path, message) {
        var _this = _super.call(this, message) || this;
        _this.path = path;
        // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work for info about this workaround.
        Object.setPrototypeOf(_this, VError.prototype);
        return _this;
    }
    return VError;
}(Error));
exports.VError = VError;
/**
 * Fast implementation of IContext used for first-pass validation. If that fails, we can validate
 * using DetailContext to collect error messages. That's faster for the common case when messages
 * normally pass validation.
 */
var NoopContext = /** @class */ (function () {
    function NoopContext() {
        this._failed = false;
    }
    NoopContext.prototype.fail = function (relPath, message, score) {
        this._failed = true;
        return false;
    };
    NoopContext.prototype.fork = function () {
        return this;
    };
    NoopContext.prototype.completeFork = function () {
        return !this._failed;
    };
    NoopContext.prototype.failed = function () {
        return this._failed;
    };
    NoopContext.prototype.unionResolver = function () { return this; };
    NoopContext.prototype.createContext = function () {
        this._failed = false;
        return this;
    };
    NoopContext.prototype.resolveUnion = function (ur) { };
    return NoopContext;
}());
exports.NoopContext = NoopContext;
/**
 * Complete implementation of IContext that collects meaningfull errors.
 */
var DetailContext = /** @class */ (function () {
    function DetailContext() {
        // Stack of property names and associated messages for reporting helpful error messages.
        this._propNames = [];
        this._messages = [];
        /** Contexts created by fork() which have completed and contain failures */
        this._failedForks = [];
        /**
         * Contains the context returned by fork() which should be checked until
         * completeFork() is called.
         * Will be reused for the next fork() if there are no failures.
         */
        this._currentFork = null;
        // Score is used to choose the best union member whose DetailContext to use for reporting.
        // Higher score means better match (or rather less severe mismatch).
        this._score = 0;
    }
    DetailContext.prototype.fail = function (relPath, message, score) {
        this._propNames.push(relPath);
        this._messages.push(message);
        this._score += score;
        return false;
    };
    DetailContext.prototype.unionResolver = function () {
        return new DetailUnionResolver();
    };
    DetailContext.prototype.resolveUnion = function (unionResolver) {
        var _a, _b, _c;
        var u = unionResolver;
        var best = null;
        for (var _i = 0, _d = u.contexts; _i < _d.length; _i++) {
            var ctx = _d[_i];
            if (!best || ctx._score >= best._score) {
                best = ctx;
            }
        }
        if (best && best._score > 0) {
            (_a = this._propNames).push.apply(_a, best._propNames);
            (_b = this._messages).push.apply(_b, best._messages);
            (_c = this._failedForks).push.apply(_c, best._failedForks);
        }
    };
    DetailContext.prototype.getError = function (path) {
        var fullMessage = flatten(this.getErrorDetails(path).map(errorLines))
            .join("\n");
        return new VError(path, fullMessage);
    };
    DetailContext.prototype.getErrorDetails = function (path) {
        var detail = null;
        var nested;
        var details = [];
        // As checkers call fail() and return to their parent checkers,
        // the deepest failures are recorded first.
        // Go through failures in reverse to start from the root type
        for (var i = this._propNames.length - 1; i >= 0; i--) {
            var p = this._propNames[i];
            path += (typeof p === "number") ? "[" + p + "]" : (p ? "." + p : "");
            var message = this._messages[i];
            if (!message) {
                continue;
            }
            nested = { path: path, message: message };
            if (detail) {
                detail.nested = [nested];
            }
            else {
                // This is the root failure, so it will be returned
                details.push(nested);
            }
            // Move into the deeper error
            detail = nested;
        }
        var forkErrors = flatten(this._failedForks.map(function (fork) { return fork.getErrorDetails(path); }));
        if (detail) {
            // don't put an empty array in detail.nested
            if (forkErrors.length) {
                // detail is the deepest nested error, so detail.nested is null at this point
                detail.nested = forkErrors;
            }
        }
        else {
            // There were no 'plain' failures, only fork failures
            details = forkErrors;
        }
        return details;
    };
    DetailContext.prototype.fork = function () {
        if (this._currentFork == null) {
            this._currentFork = new DetailContext();
        }
        return this._currentFork;
    };
    DetailContext.prototype.completeFork = function () {
        var fork = this._currentFork;
        if (fork._failed()) {
            this._failedForks.push(fork);
            this._currentFork = null;
            // To preserve old behaviour, use the score of the first failure
            // Might want to revise this
            if (this._failedForks.length === 1) {
                this._score = fork._score;
            }
        }
        return this._failedForks.length < DetailContext.maxForks;
    };
    // failed() is the public interface,
    // it gets monkeypatched to ensure correct usage in checkers.
    // _failed() may be called internally
    // in ways which would fail the monkeypatched assertions.
    DetailContext.prototype.failed = function () {
        return this._failed();
    };
    DetailContext.prototype._failed = function () {
        return this._propNames.length + this._failedForks.length > 0;
    };
    /**
     * Maximum number of errors recorded at one level for an object,
     * i.e. the maximum length of Checker.validate() or IErrorDetail.nested.
     */
    // If _failedForks has this length then completeFork() should return false
    // so that the checker stops making more forks.
    DetailContext.maxForks = 3;
    return DetailContext;
}());
exports.DetailContext = DetailContext;
var DetailUnionResolver = /** @class */ (function () {
    function DetailUnionResolver() {
        this.contexts = [];
    }
    DetailUnionResolver.prototype.createContext = function () {
        var ctx = new DetailContext();
        this.contexts.push(ctx);
        return ctx;
    };
    return DetailUnionResolver;
}());
/**
 * Returns lines of a message describing `error`.
 * The lines should be newline separated in the final message.
 * Only returns multiple lines if `error` or a descendant
 * has multiple errors in its `.nested` array.
 * Simple paths of nested errors anywhere in the tree
 * are collapsed into a single line until a branch is reached.
 */
var errorLines = function (error) {
    var rootMessage = error.path + " " + error.message;
    var nestedErrors = error.nested || [];
    var nestedLines = flatten(nestedErrors.map(errorLines));
    if (nestedErrors.length == 1) {
        // Single nested errors are collapsed into the first line,
        // but they may have branches deeper down leading to more lines
        // which are already indented
        var first = nestedLines[0], rest = nestedLines.slice(1);
        return __spreadArrays([
            rootMessage + "; " + first
        ], rest);
    }
    else {
        // Indent messages from nested errors
        // or just return [rootMessage] if there are no nested errors
        return __spreadArrays([
            rootMessage
        ], nestedLines.map(function (line) { return "    " + line; }));
    }
};
/** Shallow flatten a 2D array into a 1D array */
function flatten(arr) {
    var _a;
    return (_a = []).concat.apply(_a, arr);
}
