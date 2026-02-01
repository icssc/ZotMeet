import { Table } from "./table.cjs";
import { AnyColumn } from "./column.cjs";
import { entityKind } from "./entity.cjs";

//#region src/primary-key.d.ts
declare abstract class PrimaryKey {
  readonly table: Table;
  readonly columns: AnyColumn[];
  static readonly [entityKind]: string;
  protected $brand: 'PrimaryKey';
  constructor(table: Table, columns: AnyColumn[]);
}
//#endregion
export { PrimaryKey };
//# sourceMappingURL=primary-key.d.cts.map