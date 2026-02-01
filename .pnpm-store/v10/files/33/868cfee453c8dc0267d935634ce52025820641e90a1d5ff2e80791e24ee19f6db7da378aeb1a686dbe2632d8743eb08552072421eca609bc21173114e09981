import { cockroachSequence } from "./sequence.cjs";
import { CockroachEnum, CockroachEnumObject } from "./columns/enum.cjs";
import { CockroachTableFn } from "./table.cjs";
import { cockroachMaterializedView, cockroachView } from "./view.cjs";
import { entityKind } from "../entity.cjs";
import { SQL, SQLWrapper } from "../sql/sql.cjs";
import { NonArray, Writable } from "../utils.cjs";

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
//# sourceMappingURL=schema.d.cts.map