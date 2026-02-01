import { SQLiteTable } from "./table.js";
import { entityKind } from "../entity.js";
import { SQL } from "../sql/sql.js";

//#region src/sqlite-core/checks.d.ts
declare class CheckBuilder {
  name: string;
  value: SQL;
  static readonly [entityKind]: string;
  protected brand: 'SQLiteConstraintBuilder';
  constructor(name: string, value: SQL);
  build(table: SQLiteTable): Check;
}
declare class Check {
  table: SQLiteTable;
  static readonly [entityKind]: string;
  _: {
    brand: 'SQLiteCheck';
  };
  readonly name: string;
  readonly value: SQL;
  constructor(table: SQLiteTable, builder: CheckBuilder);
}
declare function check(name: string, value: SQL): CheckBuilder;
//#endregion
export { Check, CheckBuilder, check };
//# sourceMappingURL=checks.d.ts.map