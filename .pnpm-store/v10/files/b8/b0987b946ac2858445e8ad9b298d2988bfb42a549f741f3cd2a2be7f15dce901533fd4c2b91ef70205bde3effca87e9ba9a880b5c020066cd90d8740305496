import "./columns/index.cjs";
import { PgColumn } from "./columns/common.cjs";
import { PgTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/pg-core/unique-constraint.d.ts
declare function unique(name?: string): UniqueOnConstraintBuilder;
declare function uniqueKeyName(table: PgTable, columns: string[]): string;
declare class UniqueConstraintBuilder {
  private name?;
  static readonly [entityKind]: string;
  constructor(columns: PgColumn[], name?: string | undefined);
  nullsNotDistinct(): this;
}
declare class UniqueOnConstraintBuilder {
  static readonly [entityKind]: string;
  constructor(name?: string);
  on(...columns: [PgColumn, ...PgColumn[]]): UniqueConstraintBuilder;
}
declare class UniqueConstraint {
  readonly table: PgTable;
  static readonly [entityKind]: string;
  readonly columns: PgColumn[];
  readonly name?: string;
  readonly isNameExplicit: boolean;
  readonly nullsNotDistinct: boolean;
  constructor(table: PgTable, columns: PgColumn[], nullsNotDistinct: boolean, name?: string);
  getName(): string | undefined;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique, uniqueKeyName };
//# sourceMappingURL=unique-constraint.d.cts.map