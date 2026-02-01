import { SingleStoreTable } from "../table.cjs";
import { SingleStoreSession } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { SQL, SQLWrapper } from "../../sql/sql.cjs";

//#region src/singlestore-core/query-builders/count.d.ts
declare class SingleStoreCountBuilder<TSession extends SingleStoreSession<any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
  readonly params: {
    source: SingleStoreTable | /* SingleStoreViewBase | */SQL | SQLWrapper;
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
    source: SingleStoreTable | /* SingleStoreViewBase | */SQL | SQLWrapper;
    filters?: SQL<unknown>;
    session: TSession;
  });
  then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
  catch(onRejected?: ((reason: any) => never | PromiseLike<never>) | null | undefined): Promise<number>;
  finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
//#endregion
export { SingleStoreCountBuilder };
//# sourceMappingURL=count.d.cts.map