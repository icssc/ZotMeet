import { SQLiteSelectBuilder } from "./select.cjs";
import { SelectedFields } from "./select.types.cjs";
import { entityKind } from "../../entity.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { SQLiteDialect, SQLiteDialectConfig } from "../dialect.cjs";
import { WithBuilder } from "../subquery.cjs";

//#region src/sqlite-core/query-builders/query-builder.d.ts
declare class QueryBuilder {
  static readonly [entityKind]: string;
  private dialect;
  private dialectConfig;
  constructor(dialect?: SQLiteDialect | SQLiteDialectConfig);
  $with: WithBuilder;
  with(...queries: WithSubquery[]): {
    select: {
      (): SQLiteSelectBuilder<undefined, "sync", void, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, "sync", void, "qb">;
    };
    selectDistinct: {
      (): SQLiteSelectBuilder<undefined, "sync", void, "qb">;
      <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, "sync", void, "qb">;
    };
  };
  select(): SQLiteSelectBuilder<undefined, 'sync', void, 'qb'>;
  select<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, 'sync', void, 'qb'>;
  selectDistinct(): SQLiteSelectBuilder<undefined, 'sync', void, 'qb'>;
  selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, 'sync', void, 'qb'>;
  private getDialect;
}
//#endregion
export { QueryBuilder };
//# sourceMappingURL=query-builder.d.cts.map