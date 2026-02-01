import { type Client, type Config, type ResultSet } from '@libsql/client';
import type { BatchItem, BatchResponse } from "../batch.js";
import { entityKind } from "../entity.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import type { DrizzleConfig, IfNotImported, ImportTypeError } from "../utils.js";
export declare class LibSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', ResultSet, TSchema> {
    static readonly [entityKind]: string;
    batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends Client = Client>(...params: IfNotImported<Client, [
    ImportTypeError<'@libsql/client'>
], [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | Config;
    } | {
        client: TClient;
    }))
]>): LibSQLDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): LibSQLDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
