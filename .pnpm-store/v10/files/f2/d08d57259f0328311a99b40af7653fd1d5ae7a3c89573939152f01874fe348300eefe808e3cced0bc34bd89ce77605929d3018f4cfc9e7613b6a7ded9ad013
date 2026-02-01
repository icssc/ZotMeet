import { GelColumn, GelColumnBuilder } from "./common.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnBaseConfig } from "../../column.cjs";

//#region src/gel-core/columns/text.d.ts
declare class GelTextBuilder extends GelColumnBuilder<{
  dataType: 'string';
  data: string;
  driverParam: string;
}> {
  static readonly [entityKind]: string;
  constructor(name: string);
}
declare class GelText<T extends ColumnBaseConfig<'string'>> extends GelColumn<T, {
  enumValues: T['enumValues'];
}> {
  static readonly [entityKind]: string;
  readonly enumValues: T["enumValues"];
  getSQLType(): string;
}
declare function text(name?: string): GelTextBuilder;
//#endregion
export { GelText, GelTextBuilder, text };
//# sourceMappingURL=text.d.cts.map