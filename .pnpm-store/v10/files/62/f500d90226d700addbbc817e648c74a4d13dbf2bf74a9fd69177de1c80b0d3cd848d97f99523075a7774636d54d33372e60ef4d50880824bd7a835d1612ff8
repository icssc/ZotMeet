import { entityKind } from "./entity.js";
import { Casing } from "./utils.js";
import { Column } from "./column.js";

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
//# sourceMappingURL=casing.d.ts.map