import { PreparedQueryConfig } from "../session.js";
import { PgRelationalQuery, PgRelationalQueryHKTBase } from "../query-builders/query.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import { RunnableQuery } from "../../runnable-query.js";

//#region src/pg-core/async/query.d.ts
type AnyPgAsyncRelationalQuery = PgAsyncRelationalQuery<any>;
interface PgAsyncRelationalQueryHKT extends PgRelationalQueryHKTBase {
  _type: PgAsyncRelationalQuery<this['result']>;
}
interface PgAsyncRelationalQuery<TResult> extends QueryPromise<TResult> {}
declare class PgAsyncRelationalQuery<TResult> extends PgRelationalQuery<PgAsyncRelationalQueryHKT, TResult> implements RunnableQuery<TResult, 'pg'> {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  prepare(name: string): PgAsyncPreparedQuery<PreparedQueryConfig & {
    execute: TResult;
  }>;
  execute(placeholderValues?: Record<string, unknown>): Promise<TResult>;
}
//#endregion
export { AnyPgAsyncRelationalQuery, PgAsyncRelationalQuery, PgAsyncRelationalQueryHKT };
//# sourceMappingURL=query.d.ts.map