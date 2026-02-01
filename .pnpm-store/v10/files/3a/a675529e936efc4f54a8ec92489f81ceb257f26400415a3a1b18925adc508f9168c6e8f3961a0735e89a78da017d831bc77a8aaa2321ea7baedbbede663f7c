import { Subquery } from "./subquery.cjs";
import { Table } from "./table.cjs";
import { SQL } from "./sql/sql.cjs";
import { Column } from "./column.cjs";

//#region src/operations.d.ts
type RequiredKeyOnly<TKey extends string, T extends Column> = T['_']['notNull'] extends true ? T['_']['hasDefault'] extends false ? TKey : never : never;
type OptionalKeyOnly<TKey extends string, T extends Column, OverrideT extends boolean | undefined = false> = T['_']['notNull'] extends true ? T['_']['hasDefault'] extends false ? never : T['_']['generated'] extends undefined ? T['_']['identity'] extends undefined ? TKey : T['_']['identity'] extends 'always' ? OverrideT extends true ? TKey : never : TKey : never : T['_']['generated'] extends undefined ? T['_']['identity'] extends undefined ? TKey : T['_']['identity'] extends 'always' ? OverrideT extends true ? TKey : never : TKey : never;
type SelectedFieldsFlat<TColumn extends Column> = Record<string, TColumn | SQL | SQL.Aliased | Subquery>;
type SelectedFieldsFlatFull<TColumn extends Column> = Record<string, TColumn | SQL | SQL.Aliased>;
type SelectedFields<TColumn extends Column, TTable extends Table> = Record<string, SelectedFieldsFlat<TColumn>[string] | TTable | SelectedFieldsFlat<TColumn>>;
type SelectedFieldsOrdered<TColumn extends Column> = {
  path: string[];
  field: TColumn | SQL | SQL.Aliased | Subquery;
}[];
//#endregion
export { OptionalKeyOnly, RequiredKeyOnly, SelectedFields, SelectedFieldsFlat, SelectedFieldsFlatFull, SelectedFieldsOrdered };
//# sourceMappingURL=operations.d.cts.map