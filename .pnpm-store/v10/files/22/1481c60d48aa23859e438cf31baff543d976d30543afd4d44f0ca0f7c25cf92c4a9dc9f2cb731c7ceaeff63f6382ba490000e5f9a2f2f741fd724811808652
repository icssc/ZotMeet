import { SQLiteSelectBuilder } from "./select.js";
import { SelectedFields } from "./select.types.js";
import { entityKind } from "../../entity.js";
import { WithSubquery } from "../../subquery.js";
import { SQLiteDialect, SQLiteDialectConfig } from "../dialect.js";
import { WithBuilder } from "../subquery.js";

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
//# sourceMappingURL=query-builder.d.ts.map