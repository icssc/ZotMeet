import { SQLiteColumn } from "./columns/common.js";
import "./columns/index.js";
import { SQLiteTable } from "./table.js";
import { entityKind } from "../entity.js";
import { SQL } from "../sql/sql.js";

//#region src/sqlite-core/indexes.d.ts
interface IndexConfig {
  name: string;
  columns: IndexColumn[];
  unique: boolean;
  where: SQL | undefined;
}
type IndexColumn = SQLiteColumn | SQL;
declare class IndexBuilderOn {
  private name;
  private unique;
  static readonly [entityKind]: string;
  constructor(name: string, unique: boolean);
  on(...columns: [IndexColumn, ...IndexColumn[]]): IndexBuilder;
}
declare class IndexBuilder {
  static readonly [entityKind]: string;
  _: {
    brand: 'SQLiteIndexBuilder';
  };
  constructor(name: string, columns: IndexColumn[], unique: boolean);
  /**
   * Condition for partial index.
   */
  where(condition: SQL): this;
}
declare class Index {
  static readonly [entityKind]: string;
  _: {
    brand: 'SQLiteIndex';
  };
  readonly config: IndexConfig & {
    table: SQLiteTable;
  };
  readonly isNameExplicit: boolean;
  constructor(config: IndexConfig, table: SQLiteTable);
}
declare function index(name: string): IndexBuilderOn;
declare function uniqueIndex(name: string): IndexBuilderOn;
//#endregion
export { Index, IndexBuilder, IndexBuilderOn, IndexColumn, IndexConfig, index, uniqueIndex };
//# sourceMappingURL=indexes.d.ts.map