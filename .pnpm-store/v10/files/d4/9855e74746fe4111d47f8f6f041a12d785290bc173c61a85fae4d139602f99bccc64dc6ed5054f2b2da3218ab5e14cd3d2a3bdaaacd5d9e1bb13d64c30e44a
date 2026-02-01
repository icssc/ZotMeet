import { entityKind } from "../entity.cjs";
import { ColumnsSelection, View } from "../sql/sql.cjs";

//#region src/gel-core/view-base.d.ts
declare abstract class GelViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
    readonly viewBrand: 'GelViewBase';
  };
}
//#endregion
export { GelViewBase };
//# sourceMappingURL=view-base.d.cts.map