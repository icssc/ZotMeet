import { entityKind } from "../entity.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import { BatchItem, BatchResponse } from "../batch.cjs";
import { ResultSet } from "@libsql/client";

//#region src/libsql/driver-core.d.ts
declare class LibSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', ResultSet, TSchema, TRelations> {
  static readonly [entityKind]: string;
  batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
//#endregion
export { LibSQLDatabase };
//# sourceMappingURL=driver-core.d.cts.map