import { SingleStoreSelectBuilder } from "./select.js";
import { SelectedFields } from "./select.types.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { SingleStoreDialect, SingleStoreDialectConfig } from "../dialect.js";
import { WithBuilder } from "../subquery.js";

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
//# sourceMappingURL=query-builder.d.ts.map