import { PgTable } from "../table.cjs";
import { PgDialect } from "../dialect.cjs";
import { PgSession } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { Query, QueryWithTypings, SQLWrapper } from "../../sql/sql.cjs";
import { KnownKeysOnly } from "../../utils.cjs";
import { BuildQueryResult, BuildRelationalQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../relations.cjs";

//#region src/pg-core/query-builders/query.d.ts
interface PgRelationalQueryConstructor {
  new (schema: TablesRelationalConfig, table: PgTable, tableConfig: TableRelationalConfig, dialect: PgDialect, session: PgSession, config: DBQueryConfig<'many' | 'one'> | true, mode: 'many' | 'first', parseJson: boolean): AnyPgRelationalQuery;
}
type AnyPgRelationalQuery = PgRelationalQuery<any, any>;
declare class RelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig, TBuilderHKT extends PgRelationalQueryHKTBase = PgRelationalQueryHKT> {
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private parseJson;
  private builder;
  static readonly [entityKind]: string;
  constructor(schema: TSchema, table: PgTable, tableConfig: TableRelationalConfig, dialect: PgDialect, session: PgSession, parseJson: boolean, builder?: PgRelationalQueryConstructor);
  findMany<TConfig extends DBQueryConfig<'many', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', TSchema, TFields>>): PgRelationalQueryKind<TBuilderHKT, BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TConfig extends DBQueryConfig<'one', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'one', TSchema, TFields>>): PgRelationalQueryKind<TBuilderHKT, BuildQueryResult<TSchema, TFields, TConfig> | undefined>;
}
interface PgRelationalQueryHKTBase {
  result: unknown;
  _type: unknown;
}
interface PgRelationalQueryHKT extends PgRelationalQueryHKTBase {
  _type: PgRelationalQuery<PgRelationalQueryHKT, this['result']>;
}
type PgRelationalQueryKind<T extends PgRelationalQueryHKTBase, TResult> = (T & {
  result: TResult;
})['_type'];
declare class PgRelationalQuery<THKT extends PgRelationalQueryHKTBase, TResult> implements SQLWrapper {
  protected schema: TablesRelationalConfig;
  protected table: PgTable;
  protected tableConfig: TableRelationalConfig;
  protected dialect: PgDialect;
  protected session: PgSession;
  protected config: DBQueryConfig<'many' | 'one'> | true;
  protected mode: 'many' | 'first';
  protected parseJson: boolean;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'pg';
    readonly hkt: THKT;
    readonly result: TResult;
  };
  constructor(schema: TablesRelationalConfig, table: PgTable, tableConfig: TableRelationalConfig, dialect: PgDialect, session: PgSession, config: DBQueryConfig<'many' | 'one'> | true, mode: 'many' | 'first', parseJson: boolean);
  protected _getQuery(): BuildRelationalQueryResult;
  protected _toSQL(): {
    query: BuildRelationalQueryResult;
    builtQuery: QueryWithTypings;
  };
  toSQL(): Query;
}
//#endregion
export { AnyPgRelationalQuery, PgRelationalQuery, PgRelationalQueryConstructor, PgRelationalQueryHKT, PgRelationalQueryHKTBase, PgRelationalQueryKind, RelationalQueryBuilder };
//# sourceMappingURL=query.d.cts.map