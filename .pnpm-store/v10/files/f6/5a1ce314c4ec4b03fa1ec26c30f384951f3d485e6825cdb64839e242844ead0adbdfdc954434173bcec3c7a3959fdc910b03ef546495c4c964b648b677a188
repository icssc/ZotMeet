import { MsSqlTableFn } from "./table.cjs";
import { mssqlView } from "./view.cjs";
import { entityKind } from "../entity.cjs";

//#region src/mssql-core/schema.d.ts
declare class MsSqlSchema<TName extends string = string> {
  readonly schemaName: TName;
  static readonly [entityKind]: string;
  isExisting: boolean;
  constructor(schemaName: TName);
  table: MsSqlTableFn<TName>;
  view: typeof mssqlView;
  existing(): this;
}
declare function mssqlSchema<TName extends string>(name: TName): MsSqlSchema<TName>;
//#endregion
export { MsSqlSchema, mssqlSchema };
//# sourceMappingURL=schema.d.cts.map