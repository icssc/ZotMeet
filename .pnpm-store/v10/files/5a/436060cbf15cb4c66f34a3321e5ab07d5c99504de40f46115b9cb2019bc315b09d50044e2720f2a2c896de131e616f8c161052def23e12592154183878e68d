import { cockroachSequence } from "./sequence.js";
import { CockroachEnum, CockroachEnumObject } from "./columns/enum.js";
import { CockroachTableFn } from "./table.js";
import { cockroachMaterializedView, cockroachView } from "./view.js";
import { entityKind } from "../entity.js";
import { NonArray, Writable } from "../utils.js";
import { SQL, SQLWrapper } from "../sql/sql.js";

//#region src/cockroach-core/schema.d.ts
declare class CockroachSchema<TName extends string = string> implements SQLWrapper {
  readonly schemaName: TName;
  static readonly [entityKind]: string;
  isExisting: boolean;
  constructor(schemaName: TName);
  table: CockroachTableFn<TName>;
  view: typeof cockroachView;
  materializedView: typeof cockroachMaterializedView;
  enum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): CockroachEnum<Writable<T>>;
  enum<E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): CockroachEnumObject<E>;
  sequence: typeof cockroachSequence;
  getSQL(): SQL;
  shouldOmitSQLParens(): boolean;
  existing(): this;
}
declare function isCockroachSchema(obj: unknown): obj is CockroachSchema;
declare function cockroachSchema<T extends string>(name: T): CockroachSchema<T>;
//#endregion
export { CockroachSchema, cockroachSchema, isCockroachSchema };
//# sourceMappingURL=schema.d.ts.map