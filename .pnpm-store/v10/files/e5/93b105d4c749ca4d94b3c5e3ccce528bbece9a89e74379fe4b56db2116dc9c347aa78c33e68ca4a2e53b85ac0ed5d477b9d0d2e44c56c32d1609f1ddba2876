/**
 * A simple cache (or memoizer) for function calls. It is used to avoid recursive calls that may
 * lead to infinite recursion.
 *
 * It has a simple interface similar to Map, but takes an array of arguments as a key, and has
 * linear performance for all methods, so is only suitable for small caches.
 */
export declare function arrayEqual<T extends any[]>(a: T, b: T): boolean;
export declare class CallCache<K extends any[], V> {
    private _cache;
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    delete(key: K): void;
}
