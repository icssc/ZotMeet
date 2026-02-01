import { entityKind } from "../entity.js";
import { ColumnsSelection, View } from "../sql/sql.js";

//#region src/sqlite-core/view-base.d.ts
declare abstract class SQLiteViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelection extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelection> {
  static readonly [entityKind]: string;
  _: View<TName, TExisting, TSelection>['_'] & {
    viewBrand: 'SQLiteView';
  };
}
//#endregion
export { SQLiteViewBase };
//# sourceMappingURL=view-base.d.ts.map