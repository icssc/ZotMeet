import { CockroachTable } from "../table.cjs";
import { CockroachViewBase } from "../view-base.cjs";
import { CockroachSession } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { SQL, SQLWrapper } from "../../sql/sql.cjs";
import { NeonAuthToken } from "../../utils.cjs";

//#region src/cockroach-core/query-builders/count.d.ts
declare class CockroachCountBuilder<TSession extends CockroachSession<any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
  readonly params: {
    source: CockroachTable | CockroachViewBase | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    session: TSession;
  };
  private sql;
  private token?;
  static readonly [entityKind]: string;
  [Symbol.toStringTag]: string;
  private session;
  private static buildEmbeddedCount;
  private static buildCount;
  constructor(params: {
    source: CockroachTable | CockroachViewBase | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    session: TSession;
  });
  /** @intrnal */
  setToken(token?: NeonAuthToken): this;
  then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
  catch(onRejected?: ((reason: any) => any) | null | undefined): Promise<number>;
  finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
//#endregion
export { CockroachCountBuilder };
//# sourceMappingURL=count.d.cts.map