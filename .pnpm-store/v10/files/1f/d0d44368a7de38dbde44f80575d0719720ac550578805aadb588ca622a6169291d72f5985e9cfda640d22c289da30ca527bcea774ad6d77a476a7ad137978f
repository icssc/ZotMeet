import { type QueryResult, type QueryResultRow, type VercelPool } from '@vercel/postgres';
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { PgDatabase } from "../pg-core/db.cjs";
import { PgDialect } from "../pg-core/index.cjs";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.cjs";
import type { DrizzleConfig, IfNotImported, ImportTypeError } from "../utils.cjs";
import { type VercelPgClient, type VercelPgQueryResultHKT, VercelPgSession } from "./session.cjs";
export interface VercelPgDriverOptions {
    logger?: Logger;
}
export declare class VercelPgDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: VercelPgClient, dialect: PgDialect, options?: VercelPgDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): VercelPgSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class VercelPgDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<VercelPgQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
type Primitive = string | number | boolean | undefined | null;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends VercelPgClient = VercelPool & (<O extends QueryResultRow>(strings: TemplateStringsArray, ...values: Primitive[]) => Promise<QueryResult<O>>)>(...params: IfNotImported<VercelPool, [
    ImportTypeError<'@vercel/postgres'>
], [
] | [
    TClient
] | [
    TClient,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        client?: TClient;
    }))
]>): VercelPgDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): VercelPgDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
export {};
