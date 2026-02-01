import { entityKind } from "./entity.js";
import { Subquery } from "./subquery.js";
import { View } from "./sql/sql.js";

//#region src/selection-proxy.d.ts
declare class SelectionProxyHandler<T extends Subquery | Record<string, unknown> | View> implements ProxyHandler<Subquery | Record<string, unknown> | View> {
  static readonly [entityKind]: string;
  private config;
  constructor(config: SelectionProxyHandler<T>['config']);
  get(subquery: T, prop: string | symbol): any;
}
//#endregion
export { SelectionProxyHandler };
//# sourceMappingURL=selection-proxy.d.ts.map