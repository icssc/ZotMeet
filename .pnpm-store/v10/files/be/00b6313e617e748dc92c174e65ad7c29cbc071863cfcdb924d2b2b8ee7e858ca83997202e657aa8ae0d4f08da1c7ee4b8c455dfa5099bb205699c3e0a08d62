import { gelSequence } from "./sequence.js";
import { GelTableFn } from "./table.js";
import { entityKind } from "../entity.js";
import { SQL, SQLWrapper } from "../sql/sql.js";

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
//# sourceMappingURL=schema.d.ts.map