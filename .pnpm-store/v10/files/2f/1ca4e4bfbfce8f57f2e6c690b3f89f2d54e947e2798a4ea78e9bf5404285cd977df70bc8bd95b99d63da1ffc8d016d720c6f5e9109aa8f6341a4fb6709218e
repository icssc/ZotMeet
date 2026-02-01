import { entityKind } from "../entity.js";
import { ColumnsSelection, View } from "../sql/sql.js";

//#region src/mysql-core/view-base.d.ts
declare abstract class MySqlViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
    readonly viewBrand: 'MySqlViewBase';
  };
}
//#endregion
export { MySqlViewBase };
//# sourceMappingURL=view-base.d.ts.map