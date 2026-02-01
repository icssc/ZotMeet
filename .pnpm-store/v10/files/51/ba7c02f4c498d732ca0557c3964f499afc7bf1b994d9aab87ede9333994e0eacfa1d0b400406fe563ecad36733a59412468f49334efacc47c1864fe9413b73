import { entityKind } from "../../entity.cjs";
import { Query } from "../../sql/sql.cjs";
import { EmptyRelations } from "../../relations.cjs";
import { Logger } from "../../logger.cjs";
import { PreparedQueryConfig, SQLiteAsyncDialect, SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, SQLiteTransaction, SQLiteTransactionConfig, SelectedFieldsOrdered } from "../../sqlite-core/index.cjs";
import { PrismaClient } from "@prisma/client/extension";

//#region src/prisma/sqlite/session.d.ts
type PreparedQueryConfig$1 = Omit<PreparedQueryConfig, 'statement' | 'run'>;
declare class PrismaSQLitePreparedQuery<T extends PreparedQueryConfig$1 = PreparedQueryConfig$1> extends SQLitePreparedQuery<{
  type: 'async';
  run: [];
  all: T['all'];
  get: T['get'];
  values: never;
  execute: T['execute'];
}> {
  private readonly prisma;
  private readonly logger;
  static readonly [entityKind]: string;
  constructor(prisma: PrismaClient, query: Query, logger: Logger, executeMethod: SQLiteExecuteMethod);
  all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
  run(placeholderValues?: Record<string, unknown> | undefined): Promise<[]>;
  get(placeholderValues?: Record<string, unknown> | undefined): Promise<T['get']>;
  values(_placeholderValues?: Record<string, unknown> | undefined): Promise<never>;
  isResponseInArrayMode(): boolean;
}
interface PrismaSQLiteSessionOptions {
  logger?: Logger;
}
declare class PrismaSQLiteSession extends SQLiteSession<'async', unknown, Record<string, never>, EmptyRelations, Record<string, never>> {
  private readonly prisma;
  static readonly [entityKind]: string;
  private readonly logger;
  constructor(prisma: PrismaClient, dialect: SQLiteAsyncDialect, options: PrismaSQLiteSessionOptions);
  prepareQuery<T extends Omit<PreparedQueryConfig$1, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod): PrismaSQLitePreparedQuery<T>;
  prepareRelationalQuery<T extends Omit<PreparedQueryConfig$1, 'run'>>(): PrismaSQLitePreparedQuery<T>;
  transaction<T>(_transaction: (tx: SQLiteTransaction<'async', unknown, Record<string, never>, EmptyRelations, Record<string, never>>) => Promise<T>, _config?: SQLiteTransactionConfig): Promise<T>;
}
//#endregion
export { PrismaSQLitePreparedQuery, PrismaSQLiteSession, PrismaSQLiteSessionOptions };
//# sourceMappingURL=session.d.cts.map