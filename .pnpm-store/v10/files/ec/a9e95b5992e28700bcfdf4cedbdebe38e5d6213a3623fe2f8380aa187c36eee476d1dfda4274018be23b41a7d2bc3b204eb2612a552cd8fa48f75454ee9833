import { Dialect } from "./column-builder.js";
import { RunnableQuery } from "./runnable-query.js";

//#region src/batch.d.ts
type BatchItem<TDialect extends Dialect = Dialect> = RunnableQuery<any, TDialect>;
type BatchResponse<T extends BatchItem[] | readonly BatchItem[]> = { [K in keyof T]: T[K]['_']['result'] };
//#endregion
export { BatchItem, BatchResponse };
//# sourceMappingURL=batch.d.ts.map