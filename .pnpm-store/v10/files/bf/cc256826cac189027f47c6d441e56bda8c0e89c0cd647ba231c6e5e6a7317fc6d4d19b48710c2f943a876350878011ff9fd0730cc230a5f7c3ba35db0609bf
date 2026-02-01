import { entityKind } from "./entity.cjs";
import { Casing } from "./utils.cjs";
import { Column } from "./column.cjs";

//#region src/casing.d.ts
declare function toSnakeCase(input: string): string;
declare function toCamelCase(input: string): string;
declare class CasingCache {
  static readonly [entityKind]: string;
  private cachedTables;
  private convert;
  constructor(casing?: Casing);
  getColumnCasing(column: Column): string;
  private cacheTable;
  clearCache(): void;
}
//#endregion
export { CasingCache, toCamelCase, toSnakeCase };
//# sourceMappingURL=casing.d.cts.map