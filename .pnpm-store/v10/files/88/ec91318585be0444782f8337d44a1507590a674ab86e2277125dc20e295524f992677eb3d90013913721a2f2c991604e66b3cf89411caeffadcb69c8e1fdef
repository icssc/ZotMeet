import { GelTable } from "../table.js";
import { GelViewBase } from "../view-base.js";
import { GelSession } from "../session.js";
import { entityKind } from "../../entity.js";
import { SQL, SQLWrapper } from "../../sql/sql.js";

//#region src/gel-core/query-builders/count.d.ts
declare class GelCountBuilder<TSession extends GelSession<any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
  readonly params: {
    source: GelTable | GelViewBase | SQL | SQLWrapper;
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
    source: GelTable | GelViewBase | SQL | SQLWrapper;
    filters?: SQL<unknown>;
    session: TSession;
  });
  then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
  catch(onRejected?: ((reason: any) => any) | null | undefined): Promise<number>;
  finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
//#endregion
export { GelCountBuilder };
//# sourceMappingURL=count.d.ts.map