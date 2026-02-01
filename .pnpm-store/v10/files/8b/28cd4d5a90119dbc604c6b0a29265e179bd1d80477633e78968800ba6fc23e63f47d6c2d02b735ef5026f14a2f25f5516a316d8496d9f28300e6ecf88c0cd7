import { entityKind } from "../entity.cjs";
import { ColumnsSelection, View } from "../sql/sql.cjs";

//#region src/cockroach-core/view-base.d.ts
declare abstract class CockroachViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
  static readonly [entityKind]: string;
  readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
    readonly viewBrand: 'CockroachViewBase';
  };
}
//#endregion
export { CockroachViewBase };
//# sourceMappingURL=view-base.d.cts.map