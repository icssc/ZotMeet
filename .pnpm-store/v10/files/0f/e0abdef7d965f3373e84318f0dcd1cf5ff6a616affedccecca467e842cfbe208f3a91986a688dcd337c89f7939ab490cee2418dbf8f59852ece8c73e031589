import { Table } from "./table.js";
import { AnyColumn } from "./column.js";
import { entityKind } from "./entity.js";

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
//# sourceMappingURL=primary-key.d.ts.map