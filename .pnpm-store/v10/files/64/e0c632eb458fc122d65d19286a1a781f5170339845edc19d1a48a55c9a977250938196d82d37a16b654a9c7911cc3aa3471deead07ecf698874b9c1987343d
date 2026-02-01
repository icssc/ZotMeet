import { entityKind } from "./entity.js";
import { SQL, SQLWrapper } from "./sql/sql.js";

//#region src/subquery.d.ts
interface Subquery<TAlias extends string = string, TSelectedFields extends Record<string, unknown> = Record<string, unknown>> extends SQLWrapper {}
declare class Subquery<TAlias extends string = string, TSelectedFields extends Record<string, unknown> = Record<string, unknown>> implements SQLWrapper {
  static readonly [entityKind]: string;
  _: {
    brand: 'Subquery';
    sql: SQL;
    selectedFields: TSelectedFields;
    alias: TAlias;
    isWith: boolean;
    usedTables?: string[];
  };
  constructor(sql: SQL, fields: TSelectedFields, alias: string, isWith?: boolean, usedTables?: string[]);
}
declare class WithSubquery<TAlias extends string = string, TSelection extends Record<string, unknown> = Record<string, unknown>> extends Subquery<TAlias, TSelection> {
  static readonly [entityKind]: string;
}
type WithSubqueryWithoutSelection<TAlias extends string> = WithSubquery<TAlias, {}>;
//#endregion
export { Subquery, WithSubquery, WithSubqueryWithoutSelection };
//# sourceMappingURL=subquery.d.ts.map