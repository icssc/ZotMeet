import { BunMySqlDatabase, BunMySqlDrizzleConfig } from "./mysql/driver.js";
import { BunSQLDatabase } from "./postgres/driver.js";
import { BunSQLiteDatabase } from "./sqlite/driver.js";
import { DrizzleConfig } from "../utils.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { SQL } from "bun";

//#region src/bun-sql/driver.d.ts
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | ({
    url?: string;
  } & SQL.Options);
} | {
  client: TClient;
}))]): BunSQLDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): BunSQLDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
  function postgres<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
    connection: string | ({
      url?: string;
    } & SQL.Options);
  } | {
    client: TClient;
  }))]): BunSQLDatabase<TSchema, TRelations> & {
    $client: TClient;
  };
  namespace postgres {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): BunSQLDatabase<TSchema, TRelations> & {
      $client: '$client is not available on drizzle.mock()';
    };
  }
  function sqlite<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
    connection: string | ({
      url?: string;
    } & SQL.Options);
  } | {
    client: TClient;
  }))]): BunSQLiteDatabase<TSchema, TRelations> & {
    $client: TClient;
  };
  namespace sqlite {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): BunSQLiteDatabase<TSchema, TRelations> & {
      $client: '$client is not available on drizzle.mock()';
    };
  }
  function mysql<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends SQL = SQL>(...params: [string] | [string, BunMySqlDrizzleConfig<TSchema, TRelations>] | [(BunMySqlDrizzleConfig<TSchema, TRelations> & ({
    connection: string | ({
      url?: string;
    } & SQL.Options);
  } | {
    client: TClient;
  }))]): BunMySqlDatabase<TSchema, TRelations> & {
    $client: TClient;
  };
  namespace mysql {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: BunMySqlDrizzleConfig<TSchema, TRelations>): BunMySqlDatabase<TSchema, TRelations> & {
      $client: '$client is not available on drizzle.mock()';
    };
  }
}
//#endregion
export { drizzle };
//# sourceMappingURL=driver.d.ts.map