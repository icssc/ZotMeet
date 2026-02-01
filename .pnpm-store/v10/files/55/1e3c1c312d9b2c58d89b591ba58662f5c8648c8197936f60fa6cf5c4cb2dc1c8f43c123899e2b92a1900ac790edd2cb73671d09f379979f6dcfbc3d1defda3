import { MySqlColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { MySqlTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";

//#region src/mysql-core/unique-constraint.d.ts
declare function unique<TName extends string | undefined = undefined>(name?: TName): UniqueOnConstraintBuilder<TName>;
declare function uniqueKeyName(table: MySqlTable, columns: string[]): string;
declare class UniqueConstraintBuilder<TName extends string | undefined = undefined> {
  static readonly [entityKind]: string;
  constructor(columns: MySqlColumn[], name?: TName);
}
declare class UniqueOnConstraintBuilder<TName extends string | undefined = undefined> {
  static readonly [entityKind]: string;
  constructor(name?: TName);
  on(...columns: [MySqlColumn, ...MySqlColumn[]]): UniqueConstraintBuilder<TName>;
}
declare class UniqueConstraint {
  readonly table: MySqlTable;
  static readonly [entityKind]: string;
  readonly columns: MySqlColumn[];
  readonly name: string;
  readonly isNameExplicit: boolean;
  readonly nullsNotDistinct: boolean;
  constructor(table: MySqlTable, columns: MySqlColumn[], name?: string);
  getName(): string;
}
//#endregion
export { UniqueConstraint, UniqueConstraintBuilder, UniqueOnConstraintBuilder, unique, uniqueKeyName };
//# sourceMappingURL=unique-constraint.d.cts.map