import { SingleStoreDriverClient, SingleStoreDriverPreparedQueryHKT, SingleStoreDriverQueryResultHKT, SingleStoreDriverSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { RelationalSchemaConfig, TablesRelationalConfig } from "../_relations.cjs";
import { Cache } from "../cache/core/cache.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { Connection, Pool } from "mysql2/promise";
import { SingleStoreDialect } from "../singlestore-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import { Connection as Connection$1, Pool as Pool$1, PoolOptions as PoolOptions$1 } from "mysql2";
import { SingleStoreDatabase, SingleStoreDatabase as SingleStoreDatabase$1 } from "../singlestore-core/db.cjs";

//#region src/singlestore/driver.d.ts
interface SingleStoreDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class SingleStoreDriverDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: SingleStoreDriverClient, dialect: SingleStoreDialect, options?: SingleStoreDriverOptions);
  createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined, relations: AnyRelations): SingleStoreDriverSession<Record<string, unknown>, AnyRelations, TablesRelationalConfig>;
}
declare class SingleStoreDriverDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends SingleStoreDatabase$1<SingleStoreDriverQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type SingleStoreDriverDrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> = Omit<DrizzleConfig<TSchema, TRelations>, 'schema'> & ({
  schema: TSchema;
} | {
  schema?: undefined;
});
type AnySingleStoreDriverConnection = Pool | Connection | Pool$1 | Connection$1;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends AnySingleStoreDriverConnection = Pool$1>(...params: [string] | [string, SingleStoreDriverDrizzleConfig<TSchema, TRelations>] | [(SingleStoreDriverDrizzleConfig<TSchema, TRelations> & ({
  connection: string | PoolOptions$1;
} | {
  client: TClient;
}))]): SingleStoreDriverDatabase<TSchema, TRelations> & {
  $client: AnySingleStoreDriverConnection extends TClient ? Pool$1 : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: SingleStoreDriverDrizzleConfig<TSchema, TRelations>): SingleStoreDriverDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { AnySingleStoreDriverConnection, SingleStoreDatabase, SingleStoreDriverDatabase, SingleStoreDriverDriver, SingleStoreDriverDrizzleConfig, SingleStoreDriverOptions, drizzle };
//# sourceMappingURL=driver.d.cts.map