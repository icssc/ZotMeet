import { CockroachColumn, ExtraConfigColumn, IndexedColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { CockroachTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/sql.cjs";

//#region src/cockroach-core/indexes.d.ts
interface IndexConfig {
  name?: string;
  columns: Partial<IndexedColumn | SQL>[];
  /**
   * If true, the index will be created as `create unique index` instead of `create index`.
   */
  unique: boolean;
  /**
   * If true, the index will be created as `create index ... on only <table>` instead of `create index ... on <table>`.
   */
  only: boolean;
  /**
   * Condition for partial index.
   */
  where?: SQL;
  /**
   * The optional USING clause method for the index
   */
  method?: 'btree' | string;
}
type IndexColumn = CockroachColumn;
type CockroachIndexMethod = 'btree' | 'hash' | 'gin' | 'cspann';
declare class IndexBuilderOn {
  private unique;
  private name?;
  static readonly [entityKind]: string;
  constructor(unique: boolean, name?: string | undefined);
  on(...columns: [Partial<ExtraConfigColumn> | SQL | CockroachColumn, ...Partial<ExtraConfigColumn | SQL | CockroachColumn>[]]): IndexBuilder;
  onOnly(...columns: [Partial<ExtraConfigColumn | SQL | CockroachColumn>, ...Partial<ExtraConfigColumn | SQL | CockroachColumn>[]]): IndexBuilder;
  /**
   * Specify what index method to use. Choices are `btree`, `hash`, `gin`, `cspann`. The default method is `btree`.
   *
   * @param method The name of the index method to be used
   * @param columns
   * @returns
   */
  using(method: CockroachIndexMethod, ...columns: [Partial<ExtraConfigColumn | SQL | CockroachColumn>, ...Partial<ExtraConfigColumn | SQL | CockroachColumn>[]]): IndexBuilder;
}
interface AnyIndexBuilder {
  build(table: CockroachTable): Index;
}
interface IndexBuilder extends AnyIndexBuilder {}
declare class IndexBuilder implements AnyIndexBuilder {
  static readonly [entityKind]: string;
  constructor(columns: Partial<IndexedColumn | SQL>[], unique: boolean, only: boolean, name?: string, method?: string);
  where(condition: SQL): this;
}
declare class Index {
  static readonly [entityKind]: string;
  readonly config: IndexConfig & {
    table: CockroachTable;
  };
  readonly isNameExplicit: boolean;
  constructor(config: IndexConfig, table: CockroachTable);
}
type GetColumnsTableName<TColumns> = TColumns extends CockroachColumn ? TColumns['_']['name'] : TColumns extends CockroachColumn[] ? TColumns[number]['_']['name'] : never;
declare function index(name?: string): IndexBuilderOn;
declare function uniqueIndex(name?: string): IndexBuilderOn;
//#endregion
export { AnyIndexBuilder, CockroachIndexMethod, GetColumnsTableName, Index, IndexBuilder, IndexBuilderOn, IndexColumn, index, uniqueIndex };
//# sourceMappingURL=indexes.d.cts.map