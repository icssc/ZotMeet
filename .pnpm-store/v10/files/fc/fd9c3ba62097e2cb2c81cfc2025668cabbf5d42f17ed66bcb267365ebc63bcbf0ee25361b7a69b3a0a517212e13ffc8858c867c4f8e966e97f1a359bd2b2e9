import { entityKind } from "../entity.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { ResultSet } from "@libsql/client";
import { BatchItem, BatchResponse } from "../batch.js";

//#region src/libsql/driver-core.d.ts
declare class LibSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', ResultSet, TSchema, TRelations> {
  static readonly [entityKind]: string;
  batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
//#endregion
export { LibSQLDatabase };
//# sourceMappingURL=driver-core.d.ts.map