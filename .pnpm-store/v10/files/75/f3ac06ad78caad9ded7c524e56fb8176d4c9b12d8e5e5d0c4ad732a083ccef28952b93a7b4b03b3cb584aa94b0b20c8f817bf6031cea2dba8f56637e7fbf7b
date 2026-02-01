import { AnySQLiteSelect } from "../sqlite-core/index.js";
import * as V1 from "../sqlite-core/query-builders/_query.js";
import { SQLiteRelationalQuery } from "../sqlite-core/query-builders/query.js";

//#region src/expo-sqlite/query.d.ts
declare const useLiveQuery: <T extends Pick<AnySQLiteSelect, "_" | "then"> | SQLiteRelationalQuery<"sync", unknown> | V1.SQLiteRelationalQuery<"sync", unknown>>(query: T, deps?: unknown[]) => {
  readonly data: Awaited<T>;
  readonly error: Error | undefined;
  readonly updatedAt: Date | undefined;
};
//#endregion
export { useLiveQuery };
//# sourceMappingURL=query.d.ts.map