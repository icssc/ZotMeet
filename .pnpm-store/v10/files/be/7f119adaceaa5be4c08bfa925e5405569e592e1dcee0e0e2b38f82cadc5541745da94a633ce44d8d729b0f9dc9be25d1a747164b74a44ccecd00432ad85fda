import { SingleStoreSelectBuilder } from "./select.cjs";
import { SelectedFields } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { SingleStoreDialect, SingleStoreDialectConfig } from "../dialect.cjs";
import { WithBuilder } from "../subquery.cjs";

//#region src/singlestore-core/query-builders/query-builder.d.ts
declare class QueryBuilder {
  static readonly [entityKind]: string;
  private dialect;
  private dialectConfig;
  constructor(dialect?: SingleStoreDialect | SingleStoreDialectConfig);
  $with: WithBuilder;
  with(...queries: WithSubquery[]): {
    select: {
      (): SingleStoreSelectBuilder<undefined, never, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
    };
    selectDistinct: {
      (): SingleStoreSelectBuilder<undefined, never, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
    };
  };
  select(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
  select<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
  selectDistinct(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
  private getDialect;
}
//#endregion
export { QueryBuilder };
//# sourceMappingURL=query-builder.d.cts.map