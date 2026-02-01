import { SQLiteView } from "../view.cjs";
import { SQLiteTable } from "../table.cjs";
import { SQLiteSession } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { SQL, SQLWrapper } from "../../sql/sql.cjs";

//#region src/sqlite-core/query-builders/count.d.ts
declare class SQLiteCountBuilder<TSession extends SQLiteSession<any, any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper<number> {
  readonly params: {
    source: SQLiteTable | SQLiteView | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    session: TSession;
  };
  private sql;
  static readonly [entityKind]: string;
  [Symbol.toStringTag]: string;
  private session;
  private static buildEmbeddedCount;
  private static buildCount;
  constructor(params: {
    source: SQLiteTable | SQLiteView | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    session: TSession;
  });
  then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
  catch(onRejected?: ((reason: any) => never | PromiseLike<never>) | null | undefined): Promise<number>;
  finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
//#endregion
export { SQLiteCountBuilder };
//# sourceMappingURL=count.d.cts.map