import { GelTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/index.cjs";

//#region src/gel-core/checks.d.ts
declare class CheckBuilder {
  name: string;
  value: SQL;
  static readonly [entityKind]: string;
  protected brand: 'GelConstraintBuilder';
  constructor(name: string, value: SQL);
}
declare class Check {
  table: GelTable;
  static readonly [entityKind]: string;
  readonly name: string;
  readonly value: SQL;
  constructor(table: GelTable, builder: CheckBuilder);
}
declare function check(name: string, value: SQL): CheckBuilder;
//#endregion
export { Check, CheckBuilder, check };
//# sourceMappingURL=checks.d.cts.map