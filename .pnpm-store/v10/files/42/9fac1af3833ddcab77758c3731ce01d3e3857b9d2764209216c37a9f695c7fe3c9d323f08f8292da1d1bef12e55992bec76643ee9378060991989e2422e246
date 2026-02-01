import { LibSQLDatabase } from "../driver-core.cjs";
import { DrizzleConfig } from "../../utils.cjs";
import { AnyRelations, EmptyRelations } from "../../relations.cjs";
import { Client, Config } from "@libsql/client/web";

//#region src/libsql/web/index.d.ts
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Client = Client>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | Config;
} | {
  client: TClient;
}))]): LibSQLDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): LibSQLDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { drizzle };
//# sourceMappingURL=index.d.cts.map