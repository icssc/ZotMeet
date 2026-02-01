import { TableAliasProxyHandler } from "../alias.js";

//#region src/mssql-core/alias.ts
function alias(table, alias$1) {
	return new Proxy(table, new TableAliasProxyHandler(alias$1, false));
}

//#endregion
export { alias };
//# sourceMappingURL=alias.js.map