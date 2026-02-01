import { MySql2Client, MySql2PreparedQueryHKT, MySql2QueryResultHKT, MySql2Session } from "./session.js";
import { entityKind } from "../entity.js";
import { DrizzleConfig } from "../utils.js";
import * as V1 from "../_relations.js";
import { Logger } from "../logger.js";
import { Cache } from "../cache/core/index.js";
import { Connection, Pool } from "mysql2";
import { MySqlDatabase, MySqlDatabase as MySqlDatabase$1 } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";
import { Mode } from "../mysql-core/session.js";
import { Connection as Connection$1, Pool as Pool$1, PoolOptions as PoolOptions$1 } from "mysql2/promise";
import { AnyRelations, EmptyRelations } from "../relations.js";

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
type AnyMySql2Connection = Pool$1 | Connection$1 | Pool | Connection;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends AnyMySql2Connection = Pool$1>(...params: [string] | [string, MySql2DrizzleConfig<TSchema, TRelations>] | [(MySql2DrizzleConfig<TSchema, TRelations> & ({
  connection: string | PoolOptions$1;
} | {
  client: TClient;
}))]): MySql2Database<TSchema, TRelations> & {
  $client: AnyMySql2Connection extends TClient ? Pool$1 : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: MySql2DrizzleConfig<TSchema, TRelations>): MySql2Database<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { AnyMySql2Connection, MySql2Database, MySql2Driver, MySql2DrizzleConfig, MySqlDatabase, MySqlDriverOptions, drizzle };
//# sourceMappingURL=driver.d.ts.map