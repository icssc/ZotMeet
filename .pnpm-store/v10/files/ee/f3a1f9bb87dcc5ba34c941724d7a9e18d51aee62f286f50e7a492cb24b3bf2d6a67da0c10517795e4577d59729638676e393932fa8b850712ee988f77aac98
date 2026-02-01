import { CockroachTable } from "./table.js";
import { entityKind } from "../entity.js";
import { SQL } from "../sql/index.js";

//#region src/cockroach-core/checks.d.ts
declare class CheckBuilder {
  name: string;
  value: SQL;
  static readonly [entityKind]: string;
  protected brand: 'CockroachConstraintBuilder';
  constructor(name: string, value: SQL);
}
declare class Check {
  table: CockroachTable;
  static readonly [entityKind]: string;
  readonly name: string;
  readonly value: SQL;
  constructor(table: CockroachTable, builder: CheckBuilder);
}
declare function check(name: string, value: SQL): CheckBuilder;
//#endregion
export { Check, CheckBuilder, check };
//# sourceMappingURL=checks.d.ts.map