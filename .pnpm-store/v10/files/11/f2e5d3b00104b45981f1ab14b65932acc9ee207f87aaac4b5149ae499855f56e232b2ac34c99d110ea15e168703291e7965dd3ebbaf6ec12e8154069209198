import "./columns/index.js";
import { AnyPgColumn, PgColumn } from "./columns/common.js";
import { PgTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/pg-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnyPgColumn<{
  tableName: TTableName;
}>, TColumns extends AnyPgColumn<{
  tableName: TTableName;
}>[]>(config: {
  name?: string;
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
declare function primaryKey<TTableName extends string, TColumns extends AnyPgColumn<{
  tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  constructor(columns: PgColumn[], name?: string);
}
declare class PrimaryKey {
  readonly table: PgTable;
  static readonly [entityKind]: string;
  readonly columns: AnyPgColumn<{}>[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  constructor(table: PgTable, columns: AnyPgColumn<{}>[], name?: string);
  getName(): string;
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.ts.map