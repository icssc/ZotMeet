import { MySql2Client, MySql2PreparedQueryHKT, MySql2QueryResultHKT, MySql2Session } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { Connection, Pool, PoolOptions } from "mysql2/promise";
import { MySqlDialect } from "../mysql-core/dialect.cjs";
import { Mode } from "../mysql-core/session.cjs";
import { Logger } from "../logger.cjs";
import { Cache } from "../cache/core/index.cjs";
import { MySqlDatabase, MySqlDatabase as MySqlDatabase$1 } from "../mysql-core/db.cjs";
import { Connection as Connection$1, Pool as Pool$1 } from "mysql2";

//#region src/mysql2/driver.d.ts
interface MySqlDriverOptions {
  logger?: Logger;
  cache?: Cache;
}
declare class MySql2Driver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: MySql2Client, dialect: MySqlDialect, options?: MySqlDriverOptions);
  createSession(relations: AnyRelations, schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined, mode: Mode): MySql2Session<Record<string, unknown>, AnyRelations, V1.TablesRelationalConfig>;
}
declare class MySql2Database<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends MySqlDatabase$1<MySql2QueryResultHKT, MySql2PreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
type MySql2DrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> = Omit<DrizzleConfig<TSchema, TRelations>, 'schema'> & ({
  schema: TSchema;
  mode: Mode;
} | {
  schema?: undefined;
  mode?: Mode;
});
type AnyMySql2Connection = Pool | Connection | Pool$1 | Connection$1;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends AnyMySql2Connection = Pool>(...params: [string] | [string, MySql2DrizzleConfig<TSchema, TRelations>] | [(MySql2DrizzleConfig<TSchema, TRelations> & ({
  connection: string | PoolOptions;
} | {
  client: TClient;
}))]): MySql2Database<TSchema, TRelations> & {
  $client: AnyMySql2Connection extends TClient ? Pool : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: MySql2DrizzleConfig<TSchema, TRelations>): MySql2Database<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { AnyMySql2Connection, MySql2Database, MySql2Driver, MySql2DrizzleConfig, MySqlDatabase, MySqlDriverOptions, drizzle };
//# sourceMappingURL=driver.d.cts.map