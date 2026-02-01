import { AnySingleStoreColumn, SingleStoreColumn } from "./columns/common.cjs";
import "./columns/index.cjs";
import { SingleStoreTable } from "./table.cjs";
import { entityKind } from "../entity.cjs";
import { SQL } from "../sql/sql.cjs";

//#region src/singlestore-core/indexes.d.ts
interface IndexConfig {
  name: string;
  columns: IndexColumn[];
  /**
   * If true, the index will be created as `create unique index` instead of `create index`.
   */
  unique?: boolean;
  /**
   * If set, the index will be created as `create index ... using { 'btree' | 'hash' }`.
   */
  using?: 'btree' | 'hash';
  /**
   * If set, the index will be created as `create index ... algorithm { 'default' | 'inplace' | 'copy' }`.
   */
  algorithm?: 'default' | 'inplace' | 'copy';
  /**
   * If set, adds locks to the index creation.
   */
  lock?: 'default' | 'none' | 'shared' | 'exclusive';
}
type IndexColumn = SingleStoreColumn | SQL;
declare class IndexBuilderOn {
  private name;
  private unique;
  static readonly [entityKind]: string;
  constructor(name: string, unique: boolean);
  on(...columns: [IndexColumn, ...IndexColumn[]]): IndexBuilder;
}
interface AnyIndexBuilder {
  build(table: SingleStoreTable): Index;
}
interface IndexBuilder extends AnyIndexBuilder {}
declare class IndexBuilder implements AnyIndexBuilder {
  static readonly [entityKind]: string;
  constructor(name: string, columns: IndexColumn[], unique: boolean);
  using(using: IndexConfig['using']): this;
  algorithm(algorithm: IndexConfig['algorithm']): this;
  lock(lock: IndexConfig['lock']): this;
}
declare class Index {
  static readonly [entityKind]: string;
  readonly config: IndexConfig & {
    table: SingleStoreTable;
  };
  readonly isNameExplicit: boolean;
  constructor(config: IndexConfig, table: SingleStoreTable);
}
type GetColumnsTableName<TColumns> = TColumns extends AnySingleStoreColumn<{
  tableName: infer TTableName extends string;
}> | AnySingleStoreColumn<{
  tableName: infer TTableName extends string;
}>[] ? TTableName : never;
declare function index(name: string): IndexBuilderOn;
declare function uniqueIndex(name: string): IndexBuilderOn;
//#endregion
export { AnyIndexBuilder, GetColumnsTableName, Index, IndexBuilder, IndexBuilderOn, IndexColumn, index, uniqueIndex };
//# sourceMappingURL=indexes.d.cts.map