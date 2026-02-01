import { PreparedQueryConfig } from "../session.cjs";
import { PgRelationalQuery, PgRelationalQueryHKTBase } from "../query-builders/query.cjs";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

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
//# sourceMappingURL=query.d.cts.map