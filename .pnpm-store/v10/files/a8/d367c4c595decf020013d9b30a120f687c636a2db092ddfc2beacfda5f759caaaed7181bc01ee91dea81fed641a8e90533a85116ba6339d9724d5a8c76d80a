import { entityKind } from "../entity.cjs";
import { SQL, SQLWrapper } from "../sql/index.cjs";

//#region src/query-builders/query-builder.d.ts
declare abstract class TypedQueryBuilder<TSelection, TResult = unknown, TConfig = unknown> implements SQLWrapper {
  static readonly [entityKind]: string;
  _: {
    selectedFields: TSelection;
    result: TResult;
    config?: TConfig;
  };
  abstract getSQL(): SQL;
}
//#endregion
export { TypedQueryBuilder };
//# sourceMappingURL=query-builder.d.cts.map