import { SingleStoreColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { SingleStoreTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/singlestore-core/unique-constraint.d.ts
declare function unique(name?: string): UniqueOnConstraintBuilder;
declare function uniqueKeyName(table: SingleStoreTable, columns: string[]): string;
declare class UniqueConstraintBuilder {
  private name?;
  static readonly [entityKind]: string;
  constructor(columns: SingleStoreColumn[], name?: string | undefined);
}
declare class UniqueOnConstraintBuilder {
  static readonly [entityKind]: string;
  constructor(name?: string);
  on(...columns: [SingleStoreColumn, ...SingleStoreColumn[]]): UniqueConstraintBuilder;
}
declare class UniqueConstraint {
  readonly table: SingleStoreTable;
  static readonly [entityKind]: string;
  readonly columns: SingleStoreColumn[];
  readonly name: string;
  readonly nullsNotDistinct: boolean;
  readonly isNameExplicit: boolean;
  constructor(table: SingleStoreTable, columns: SingleStoreColumn[], name?: string);
  getName(): string;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique, uniqueKeyName };
//# sourceMappingURL=unique-constraint.d.cts.map