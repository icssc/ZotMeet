import type { Context } from './context';
import type { Env, ErrorHandler, NotFoundHandler } from './types';
/**
 * Compose middleware functions into a single function based on `koa-compose` package.
 *
 * @template E - The environment type.
 *
 * @param {[[Function, unknown], ParamIndexMap | Params][]} middleware - An array of middleware functions and their corresponding parameters.
 * @param {ErrorHandler<E>} [onError] - An optional error handler function.
 * @param {NotFoundHandler<E>} [onNotFound] - An optional not-found handler function.
 *
 * @returns {(context: Context, next?: Function) => Promise<>} - A composed middleware function.
 */
export declare const compose: <E extends Env = Env>(middleware: [
    [
        Function,
        unknown
    ],
    unknown
][] | [
    [
        Function
    ]
][], onError?: ErrorHandler<E>, onNotFound?: NotFoundHandler<E>) => ((context: Context, next?: Function) => Promise<Context>);
