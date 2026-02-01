import { entityKind } from "../entity.cjs";
import { ColumnsSelection, View } from "../sql/sql.cjs";

//#region src/pg-core/view-base.d.ts
declare abstract class PgViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
    readonly viewBrand: 'PgViewBase';
  };
}
//#endregion
export { PgViewBase };
//# sourceMappingURL=view-base.d.cts.map