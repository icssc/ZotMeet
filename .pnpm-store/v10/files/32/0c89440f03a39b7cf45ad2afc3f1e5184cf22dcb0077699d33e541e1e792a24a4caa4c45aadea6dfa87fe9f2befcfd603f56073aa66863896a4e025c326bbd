import { AnyMsSqlColumn, MsSqlColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { MsSqlTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/sql.cjs";

//#region src/mssql-core/indexes.d.ts
interface IndexConfig {
  name: string;
  columns: IndexColumn[];
  /**
   * If true, the index will be created as `create unique index` instead of `create index`.
   */
  unique?: boolean;
  /**
   * Condition for partial index.
   */
  where?: SQL;
}
type IndexColumn = MsSqlColumn | SQL;
declare class IndexBuilderOn {
  private name;
  private unique;
  static readonly [entityKind]: string;
  constructor(name: string, unique: boolean);
  on(...columns: [IndexColumn, ...IndexColumn[]]): IndexBuilder;
}
interface AnyIndexBuilder {
  build(table: MsSqlTable): Index;
}
interface IndexBuilder extends AnyIndexBuilder {}
declare class IndexBuilder implements AnyIndexBuilder {
  static readonly [entityKind]: string;
  constructor(name: string, columns: IndexColumn[], unique: boolean);
  where(condition: SQL): this;
}
declare class Index {
  static readonly [entityKind]: string;
  readonly config: IndexConfig & {
    table: MsSqlTable;
  };
  readonly isNameExplicit: boolean;
  constructor(config: IndexConfig, table: MsSqlTable);
}
type GetColumnsTableName<TColumns> = TColumns extends AnyMsSqlColumn<{
  tableName: infer TTableName extends string;
}> | AnyMsSqlColumn<{
  tableName: infer TTableName extends string;
}>[] ? TTableName : never;
declare function index(name: string): IndexBuilderOn;
declare function uniqueIndex(name: string): IndexBuilderOn;
//#endregion
export { AnyIndexBuilder, GetColumnsTableName, Index, IndexBuilder, IndexBuilderOn, IndexColumn, index, uniqueIndex };
//# sourceMappingURL=indexes.d.cts.map