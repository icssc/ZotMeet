import { SingleStoreTableFn } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/singlestore-core/schema.d.ts
declare class SingleStoreSchema<TName extends string = string> {
  readonly schemaName: TName;
  static readonly [entityKind]: string;
  constructor(schemaName: TName);
  table: SingleStoreTableFn<TName>;
}
/** @deprecated - use `instanceof SingleStoreSchema` */
declare function isSingleStoreSchema(obj: unknown): obj is SingleStoreSchema;
/**
 * Create a SingleStore schema.
 * https://docs.singlestore.com/cloud/create-a-database/
 *
 * @param name singlestore use schema name
 * @returns SingleStore schema
 */
declare function singlestoreDatabase<TName extends string>(name: TName): SingleStoreSchema<TName>;
/**
 * @see singlestoreDatabase
 */
declare const singlestoreSchema: typeof singlestoreDatabase;
//#endregion
export { SingleStoreSchema, isSingleStoreSchema, singlestoreDatabase, singlestoreSchema };
//# sourceMappingURL=schema.d.cts.map