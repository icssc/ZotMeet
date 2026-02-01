import { GelTable } from "../table.js";
import { GelDialect } from "../dialect.js";
import { GelPreparedQuery, GelSession, PreparedQueryConfig } from "../session.js";
import { entityKind } from "../../entity.js";
import { KnownKeysOnly } from "../../utils.js";
import { Query, SQLWrapper } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { QueryPromise } from "../../query-promise.js";
import { RunnableQuery } from "../../runnable-query.js";

//#region src/gel-core/query-builders/_query.d.ts
declare class _RelationalQueryBuilder<TSchema extends V1.TablesRelationalConfig, TFields extends V1.TableRelationalConfig> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: GelTable, tableConfig: V1.TableRelationalConfig, dialect: GelDialect, session: GelSession);
  findMany<TConfig extends V1.DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, V1.DBQueryConfig<'many', true, TSchema, TFields>>): GelRelationalQuery<V1.BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): GelRelationalQuery<V1.BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class GelRelationalQuery<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'gel'>, SQLWrapper {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private mode;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'gel';
    readonly result: TResult;
  };
  constructor(fullSchema: Record<string, unknown>, schema: V1.TablesRelationalConfig, tableNamesMap: Record<string, string>, table: GelTable, tableConfig: V1.TableRelationalConfig, dialect: GelDialect, session: GelSession, config: V1.DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
  prepare(name: string): GelPreparedQuery<PreparedQueryConfig & {
    execute: TResult;
  }>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
//#endregion
export { GelRelationalQuery, _RelationalQueryBuilder };
//# sourceMappingURL=_query.d.ts.map