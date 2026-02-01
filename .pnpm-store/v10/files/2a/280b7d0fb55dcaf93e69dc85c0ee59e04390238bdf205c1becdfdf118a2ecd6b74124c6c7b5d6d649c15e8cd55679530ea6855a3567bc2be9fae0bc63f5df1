import { GelTable } from "./table.cjs";
import { GelColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { entityKind } from "../entity.cjs";

//#region src/gel-core/unique-constraint.d.ts
declare function unique(name?: string): UniqueOnConstraintBuilder;
declare function uniqueKeyName(table: GelTable, columns: string[]): string;
declare class UniqueConstraintBuilder {
  private name?;
  static readonly [entityKind]: string;
  constructor(columns: GelColumn[], name?: string | undefined);
  nullsNotDistinct(): this;
}
declare class UniqueOnConstraintBuilder {
  static readonly [entityKind]: string;
  constructor(name?: string);
  on(...columns: [GelColumn, ...GelColumn[]]): UniqueConstraintBuilder;
}
declare class UniqueConstraint {
  readonly table: GelTable;
  static readonly [entityKind]: string;
  readonly columns: GelColumn[];
  readonly name?: string;
  readonly nullsNotDistinct: boolean;
  constructor(table: GelTable, columns: GelColumn[], nullsNotDistinct: boolean, name?: string);
  getName(): string | undefined;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique, uniqueKeyName };
//# sourceMappingURL=unique-constraint.d.cts.map