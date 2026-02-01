import { TursoDatabaseDatabase } from "./driver-core.cjs";
import { DrizzleConfig } from "../utils.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { Database } from "@tursodatabase/database-wasm";

//#region src/tursodatabase/wasm.d.ts
type DatabaseOpts = (Database extends {
  new (path: string, opts: infer D): any;
} ? D : any) & {
  path: string;
};
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends Database = Database>(...params: [string] | [string, DrizzleConfig<TSchema, TRelations>] | [(DrizzleConfig<TSchema, TRelations> & ({
  connection: string | DatabaseOpts;
} | {
  client: TClient;
}))]): TursoDatabaseDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config?: DrizzleConfig<TSchema, TRelations>): TursoDatabaseDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { DatabaseOpts, drizzle };
//# sourceMappingURL=wasm.d.cts.map