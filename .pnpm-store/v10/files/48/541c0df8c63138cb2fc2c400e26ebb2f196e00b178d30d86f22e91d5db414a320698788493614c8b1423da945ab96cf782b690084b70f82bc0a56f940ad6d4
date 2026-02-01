import { PgEnum, PgEnumObject } from "./columns/enum.js";
import { pgSequence } from "./sequence.js";
import { PgTableFn } from "./table.js";
import { pgMaterializedView, pgView } from "./view.js";
import { entityKind } from "../entity.js";
import { NonArray, Writable } from "../utils.js";
import { SQL, SQLWrapper } from "../sql/sql.js";

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
//# sourceMappingURL=schema.d.ts.map