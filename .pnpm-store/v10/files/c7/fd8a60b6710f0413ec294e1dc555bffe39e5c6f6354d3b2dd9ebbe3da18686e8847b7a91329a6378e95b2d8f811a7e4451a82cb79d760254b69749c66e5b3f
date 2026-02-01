import { gelSequence } from "./sequence.cjs";
import { GelTableFn } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL, SQLWrapper } from "../sql/sql.cjs";

//#region src/gel-core/schema.d.ts
declare class GelSchema<TName extends string = string> implements SQLWrapper {
  readonly schemaName: TName;
  static readonly [entityKind]: string;
  constructor(schemaName: TName);
  table: GelTableFn<TName>;
  sequence: typeof gelSequence;
  getSQL(): SQL;
  shouldOmitSQLParens(): boolean;
}
declare function isGelSchema(obj: unknown): obj is GelSchema;
declare function gelSchema<T extends string>(name: T): GelSchema<T>;
//#endregion
export { GelSchema, gelSchema, isGelSchema };
//# sourceMappingURL=schema.d.cts.map