import { MsSqlColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { MsSqlTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/mssql-core/unique-constraint.d.ts
declare function unique(name?: string): UniqueOnConstraintBuilder;
declare class UniqueConstraintBuilder {
  private name?;
  static readonly [entityKind]: string;
  constructor(columns: MsSqlColumn[], name?: string | undefined);
}
declare class UniqueOnConstraintBuilder {
  static readonly [entityKind]: string;
  constructor(name?: string);
  on(...columns: [MsSqlColumn, ...MsSqlColumn[]]): UniqueConstraintBuilder;
}
declare class UniqueConstraint {
  readonly table: MsSqlTable;
  static readonly [entityKind]: string;
  readonly columns: MsSqlColumn[];
  readonly name?: string;
  readonly nullsNotDistinct: boolean;
  readonly isNameExplicit: boolean;
  constructor(table: MsSqlTable, columns: MsSqlColumn[], name?: string);
  getName(): string | undefined;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique };
//# sourceMappingURL=unique-constraint.d.cts.map