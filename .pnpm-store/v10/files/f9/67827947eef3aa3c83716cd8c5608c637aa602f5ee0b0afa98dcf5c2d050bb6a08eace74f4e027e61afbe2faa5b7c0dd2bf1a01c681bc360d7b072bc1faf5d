"use strict";
/**
 * A simple cache (or memoizer) for function calls. It is used to avoid recursive calls that may
 * lead to infinite recursion.
 *
 * It has a simple interface similar to Map, but takes an array of arguments as a key, and has
 * linear performance for all methods, so is only suitable for small caches.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallCache = exports.arrayEqual = void 0;
function arrayEqual(a, b) {
    return a.length === b.length && a.every(function (el, i) { return (a[i] === b[i]); });
}
exports.arrayEqual = arrayEqual;
var CallCache = /** @class */ (function () {
    function CallCache() {
        this._cache = [];
    }
    CallCache.prototype.get = function (key) {
        var _a;
        return (_a = this._cache.find(function (el) { return arrayEqual(el[0], key); })) === null || _a === void 0 ? void 0 : _a[1];
    };
    CallCache.prototype.set = function (key, value) {
        var item = this._cache.find(function (el) { return arrayEqual(el[0], key); });
        if (item) {
            item[1] = value;
        }
        else {
            this._cache.push([key, value]);
        }
    };
    CallCache.prototype.delete = function (key) {
        var idx = this._cache.findIndex(function (el) { return arrayEqual(el[0], key); });
        if (idx >= 0) {
            this._cache.splice(idx, 1);
        }
    };
    return CallCache;
}());
exports.CallCache = CallCache;
