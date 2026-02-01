import { CockroachColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { CockroachTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/cockroach-core/unique-constraint.d.ts
declare function unique(name?: string): UniqueOnConstraintBuilder;
declare class UniqueConstraintBuilder {
  private name?;
  static readonly [entityKind]: string;
  constructor(columns: CockroachColumn[], name?: string | undefined);
}
declare class UniqueOnConstraintBuilder {
  static readonly [entityKind]: string;
  constructor(name?: string);
  on(...columns: [CockroachColumn, ...CockroachColumn[]]): UniqueConstraintBuilder;
}
declare class UniqueConstraint {
  readonly table: CockroachTable;
  static readonly [entityKind]: string;
  readonly columns: CockroachColumn[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  constructor(table: CockroachTable, columns: CockroachColumn[], name?: string);
  getName(): string | undefined;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique };
//# sourceMappingURL=unique-constraint.d.cts.map