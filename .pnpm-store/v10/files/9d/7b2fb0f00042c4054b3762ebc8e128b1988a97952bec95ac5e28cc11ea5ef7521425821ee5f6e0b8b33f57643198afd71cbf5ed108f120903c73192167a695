import { NeonHttpClient, NeonHttpQueryResultHKT, NeonHttpSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import { PgAsyncDatabase } from "../pg-core/async/db.cjs";
import { BatchItem, BatchResponse } from "../batch.cjs";
import { HTTPQueryOptions, HTTPTransactionOptions, NeonQueryFunction } from "@neondatabase/serverless";

//#region src/neon-http/driver.d.ts
interface NeonDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class NeonHttpDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: NeonHttpClient, dialect: PgDialect, options?: NeonDriverOptions);
  createSession(relations: AnyRelations | undefined, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): NeonHttpSession<Record<string, unknown>, EmptyRelations, V1.TablesRelationalConfig>;
  initMappers(): void;
}
declare class NeonHttpDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<NeonHttpQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
  $withAuth(token: Exclude<HTTPQueryOptions<true, true>['authToken'], undefined>): Omit<this, Exclude<keyof this, '$count' | 'delete' | 'select' | 'selectDistinct' | 'selectDistinctOn' | 'update' | 'insert' | 'with' | '_query' | 'query' | 'execute' | 'refreshMaterializedView'>>;
  batch<U extends BatchItem<'pg'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends NeonQueryFunction<any, any> = NeonQueryFunction<false, false>>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | ({
    connectionString: string;
  } & HTTPTransactionOptions<boolean, boolean>);
} | {
  client: TClient;
}))]): NeonHttpDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): NeonHttpDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { NeonDriverOptions, NeonHttpDatabase, NeonHttpDriver, drizzle };
//# sourceMappingURL=driver.d.cts.map