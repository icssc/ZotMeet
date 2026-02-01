import { CockroachTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/index.cjs";

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
//# sourceMappingURL=checks.d.cts.map