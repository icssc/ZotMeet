import { MsSqlTable } from "./table.js";
import { entityKind } from "../entity.js";
import { SQL } from "../sql/sql.js";

//#region src/mssql-core/checks.d.ts
declare class CheckBuilder {
  name: string;
  value: SQL;
  static readonly [entityKind]: string;
  protected brand: 'MsSqlConstraintBuilder';
  constructor(name: string, value: SQL);
}
declare class Check {
  table: MsSqlTable;
  static readonly [entityKind]: string;
  readonly name: string;
  readonly value: SQL;
  constructor(table: MsSqlTable, builder: CheckBuilder);
}
declare function check(name: string, value: SQL): CheckBuilder;
//#endregion
export { Check, CheckBuilder, check };
//# sourceMappingURL=checks.d.ts.map