/**
 * Error thrown by validation. Besides an informative message, it includes the path to the
 * property which triggered the failure.
 */
export declare class VError extends Error {
    path: string;
    constructor(path: string, message: string);
}
/**
 * IContext is used during validation to collect error messages. There is a "noop" fast
 * implementation that does not pay attention to messages, and a full implementation that does.
 */
export interface IContext {
    fail(relPath: string | number | null, message: string | null, score: number): false;
    unionResolver(): IUnionResolver;
    resolveUnion(ur: IUnionResolver): void;
    /**
     * Used only in checkers of types that may record multiple
     * parallel failures for a single object. After calling fork(), a checker must:
     *
     *
     * - Use the returned forked context instead of the original context for (potential) failures,
     *    whether it's in a deeper checker or when calling fail().
     * - After using the fork to check one 'thing' (e.g. a property or a base class), write:
     *
     *       if (!origContext.completeFork()) {
     *         return false;
     *       }
     *
     *    Always call completeFork(), regardless of whether there was a failure.
     *    Do this instead of returning directly after a failure as is done with non-forked type checkers.
     * - At the end of your checker function, `return !ctx.failed()`
     *    to check whether any failures were gathered along the way in forks.
     */
    fork(): IContext;
    /**
     * Must always be called after a call to fork() on the same context.
     *
     * Indicates that the checker is done with the current fork and any subsequent
     * checks on the current object will be done on a new fork.
     *
     * Returns true if the checker should keep checking the current object,
     * or false if enough failures have been noted and the checker should return now.
     *
     * If this returns false then that implies that failed() would return true,
     * although the reverse it not necessarily true.
     */
    completeFork(): boolean;
    /**
     * Returns true if any failures were recorded in this context.
     */
    failed(): boolean;
}
/**
 * This helper class is used to collect error messages reported while validating unions.
 */
export interface IUnionResolver {
    createContext(): IContext;
}
/**
 * IErrorDetail describes errors as returned by the validate() and validateStrict() methods.
 */
export interface IErrorDetail {
    path: string;
    message: string;
    nested?: IErrorDetail[];
}
/**
 * Fast implementation of IContext used for first-pass validation. If that fails, we can validate
 * using DetailContext to collect error messages. That's faster for the common case when messages
 * normally pass validation.
 */
export declare class NoopContext implements IContext, IUnionResolver {
    private _failed;
    fail(relPath: string | number | null, message: string | null, score: number): false;
    fork(): IContext;
    completeFork(): boolean;
    failed(): boolean;
    unionResolver(): IUnionResolver;
    createContext(): IContext;
    resolveUnion(ur: IUnionResolver): void;
}
/**
 * Complete implementation of IContext that collects meaningfull errors.
 */
export declare class DetailContext implements IContext {
    private _propNames;
    private _messages;
    /** Contexts created by fork() which have completed and contain failures */
    private _failedForks;
    /**
     * Maximum number of errors recorded at one level for an object,
     * i.e. the maximum length of Checker.validate() or IErrorDetail.nested.
     */
    static maxForks: number;
    /**
     * Contains the context returned by fork() which should be checked until
     * completeFork() is called.
     * Will be reused for the next fork() if there are no failures.
     */
    private _currentFork;
    private _score;
    fail(relPath: string | number | null, message: string | null, score: number): false;
    unionResolver(): IUnionResolver;
    resolveUnion(unionResolver: IUnionResolver): void;
    getError(path: string): VError;
    getErrorDetails(path: string): IErrorDetail[];
    fork(): IContext;
    completeFork(): boolean;
    failed(): boolean;
    private _failed;
}
