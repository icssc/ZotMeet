import { AnyCockroachColumn, CockroachColumn } from "./columns/common.js";
import "./columns/index.js";
import { CockroachTable } from "./table.js";
import { entityKind } from "../entity.js";

//#region src/cockroach-core/primary-keys.d.ts
declare function primaryKey<TTableName extends string, TColumn extends AnyCockroachColumn<{
  tableName: TTableName;
}>, TColumns extends AnyCockroachColumn<{
  tableName: TTableName;
}>[]>(config: {
  name?: string;
  columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
declare class PrimaryKeyBuilder {
  static readonly [entityKind]: string;
  constructor(columns: CockroachColumn[], name?: string);
}
declare class PrimaryKey {
  readonly table: CockroachTable;
  static readonly [entityKind]: string;
  readonly columns: AnyCockroachColumn<{}>[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  constructor(table: CockroachTable, columns: AnyCockroachColumn<{}>[], name?: string);
  getName(): string | undefined;
}
//#endregion
export { PrimaryKey, PrimaryKeyBuilder, primaryKey };
//# sourceMappingURL=primary-keys.d.ts.map