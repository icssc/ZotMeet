import { BunMySqlPreparedQueryHKT, BunMySqlQueryResultHKT } from "./session.js";
import { entityKind } from "../../entity.js";
import { DrizzleConfig } from "../../utils.js";
import { MySqlDatabase } from "../../mysql-core/db.js";
import { Mode } from "../../mysql-core/session.js";
import { AnyRelations, EmptyRelations } from "../../relations.js";
import { SQL } from "bun";

//#region src/bun-sql/mysql/driver.d.ts
type BunMySqlDrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> = Omit<DrizzleConfig<TSchema, TRelations>, 'schema'> & ({
  schema: TSchema;
  mode: Mode;
} | {
  schema?: undefined;
  mode?: Mode;
});
declare class BunMySqlDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends MySqlDatabase<BunMySqlQueryResultHKT, BunMySqlPreparedQueryHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, BunMySqlDrizzleConfig<TSchema, TRelations>] | [(BunMySqlDrizzleConfig<TSchema, TRelations> & ({
  connection: string | ({
    url?: string;
  } & SQL.Options);
} | {
  client: TClient;
}))]): BunMySqlDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: BunMySqlDrizzleConfig<TSchema, TRelations>): BunMySqlDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { BunMySqlDatabase, BunMySqlDrizzleConfig, drizzle };
//# sourceMappingURL=driver.d.ts.map