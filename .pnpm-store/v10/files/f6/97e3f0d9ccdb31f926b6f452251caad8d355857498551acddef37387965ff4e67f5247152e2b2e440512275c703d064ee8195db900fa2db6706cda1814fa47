import { PgEnum, PgEnumObject } from "./columns/enum.cjs";
import { pgSequence } from "./sequence.cjs";
import { PgTableFn } from "./table.cjs";
import { pgMaterializedView, pgView } from "./view.cjs";
import { entityKind } from "../entity.cjs";
import { SQL, SQLWrapper } from "../sql/sql.cjs";
import { NonArray, Writable } from "../utils.cjs";

//#region src/pg-core/schema.d.ts
declare class PgSchema<TName extends string = string> implements SQLWrapper {
  readonly schemaName: TName;
  static readonly [entityKind]: string;
  isExisting: boolean;
  constructor(schemaName: TName);
  table: PgTableFn<TName>;
  view: typeof pgView;
  materializedView: typeof pgMaterializedView;
  enum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): PgEnum<Writable<T>>;
  enum<E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): PgEnumObject<E>;
  sequence: typeof pgSequence;
  getSQL(): SQL;
  shouldOmitSQLParens(): boolean;
  existing(): this;
}
declare function isPgSchema(obj: unknown): obj is PgSchema;
declare function pgSchema<T extends string>(name: T): PgSchema<T>;
//#endregion
export { PgSchema, isPgSchema, pgSchema };
//# sourceMappingURL=schema.d.cts.map