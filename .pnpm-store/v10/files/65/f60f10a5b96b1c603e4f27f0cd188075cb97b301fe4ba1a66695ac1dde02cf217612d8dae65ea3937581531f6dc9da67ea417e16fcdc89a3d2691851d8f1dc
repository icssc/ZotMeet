import { AutoPool } from "./pool.cjs";
import { NodeMsSqlClient, NodeMsSqlPreparedQueryHKT, NodeMsSqlQueryResultHKT, NodeMsSqlSession } from "./session.cjs";
import { entityKind } from "../entity.cjs";
import { DrizzleConfig, Equal } from "../utils.cjs";
import * as V1 from "../_relations.cjs";
import { MsSqlDialect } from "../mssql-core/dialect.cjs";
import { Logger } from "../logger.cjs";
import mssql from "mssql";
import { MsSqlDatabase, MsSqlDatabase as MsSqlDatabase$1 } from "../mssql-core/db.cjs";

//#region src/node-mssql/driver.d.ts
interface MsSqlDriverOptions {
  logger?: Logger;
}
declare class NodeMsSqlDriver {
  private client;
  private dialect;
  private options;
  static readonly [entityKind]: string;
  constructor(client: NodeMsSqlClient, dialect: MsSqlDialect, options?: MsSqlDriverOptions);
  createSession(schema: V1.RelationalSchemaConfig<V1.TablesRelationalConfig> | undefined): NodeMsSqlSession<Record<string, unknown>, V1.TablesRelationalConfig>;
}
type NodeMsSqlDatabase<TSchema extends Record<string, unknown> = Record<string, never>> = MsSqlDatabase$1<NodeMsSqlQueryResultHKT, NodeMsSqlPreparedQueryHKT, TSchema>;
type NodeMsSqlDrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>> = Omit<DrizzleConfig<TSchema>, 'schema'> & ({
  schema: TSchema;
} | {
  schema?: undefined;
});
declare function getMsSqlConnectionParams(connectionString: string): mssql.config | string;
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends NodeMsSqlClient = AutoPool>(...params: [string] | [string, DrizzleConfig<TSchema>] | [(DrizzleConfig<TSchema> & ({
  connection: string;
} | {
  client: TClient;
}))]): NodeMsSqlDatabase<TSchema> & {
  $client: Equal<TClient, NodeMsSqlClient> extends true ? AutoPool : TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): NodeMsSqlDatabase<TSchema> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { MsSqlDatabase, MsSqlDriverOptions, NodeMsSqlDatabase, NodeMsSqlDriver, NodeMsSqlDrizzleConfig, drizzle, getMsSqlConnectionParams };
//# sourceMappingURL=driver.d.cts.map