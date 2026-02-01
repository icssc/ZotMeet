import { Dialect } from "./column-builder.cjs";
import { RunnableQuery } from "./runnable-query.cjs";

//#region src/batch.d.ts
type BatchItem<TDialect extends Dialect = Dialect> = RunnableQuery<any, TDialect>;
type BatchResponse<T extends BatchItem[] | readonly BatchItem[]> = { [K in keyof T]: T[K]['_']['result'] };
//#endregion
export { BatchItem, BatchResponse };
//# sourceMappingURL=batch.d.cts.map