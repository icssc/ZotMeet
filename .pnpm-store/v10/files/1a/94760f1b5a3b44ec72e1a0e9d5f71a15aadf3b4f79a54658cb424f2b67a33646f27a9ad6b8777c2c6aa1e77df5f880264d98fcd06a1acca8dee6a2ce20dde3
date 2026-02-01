import { SQLiteColumn } from "./columns/common.cjs";
import { SQLiteTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/sqlite-core/unique-constraint.d.ts
declare function uniqueKeyName(table: SQLiteTable, columns: string[]): string;
declare function unique(name?: string): UniqueOnConstraintBuilder;
declare class UniqueConstraintBuilder {
  private name?;
  static readonly [entityKind]: string;
  constructor(columns: SQLiteColumn[], name?: string | undefined);
}
declare class UniqueOnConstraintBuilder {
  static readonly [entityKind]: string;
  constructor(name?: string);
  on(...columns: [SQLiteColumn, ...SQLiteColumn[]]): UniqueConstraintBuilder;
}
declare class UniqueConstraint {
  readonly table: SQLiteTable;
  static readonly [entityKind]: string;
  readonly columns: SQLiteColumn[];
  readonly name: string;
  readonly isNameExplicit: boolean;
  constructor(table: SQLiteTable, columns: SQLiteColumn[], name?: string);
  getName(): string;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique, uniqueKeyName };
//# sourceMappingURL=unique-constraint.d.cts.map