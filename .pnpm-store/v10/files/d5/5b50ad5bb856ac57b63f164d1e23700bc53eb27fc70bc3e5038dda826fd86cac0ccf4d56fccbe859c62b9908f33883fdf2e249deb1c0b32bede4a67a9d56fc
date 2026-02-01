import { entityKind } from "../../entity.cjs";
import { Query, SQL } from "../../sql/sql.cjs";
import { EmptyRelations } from "../../relations.cjs";
import { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../../pg-core/session.cjs";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../../pg-core/async/session.cjs";
import { Logger } from "../../logger.cjs";
import { PgDialect } from "../../pg-core/index.cjs";
import { PrismaClient } from "@prisma/client/extension";

//#region src/prisma/pg/session.d.ts
declare class PrismaPgPreparedQuery<T> extends PgAsyncPreparedQuery<PreparedQueryConfig & {
  execute: T;
}> {
  private readonly prisma;
  private readonly logger;
  static readonly [entityKind]: string;
  constructor(prisma: PrismaClient, query: Query, logger: Logger);
  execute(placeholderValues?: Record<string, unknown>): Promise<T>;
  all(): Promise<unknown>;
  isResponseInArrayMode(): boolean;
}
interface PrismaPgSessionOptions {
  logger?: Logger;
}
declare class PrismaPgSession extends PgAsyncSession {
  private readonly prisma;
  private readonly options;
  static readonly [entityKind]: string;
  private readonly logger;
  constructor(dialect: PgDialect, prisma: PrismaClient, options: PrismaPgSessionOptions);
  execute<T>(query: SQL): Promise<T>;
  prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query): PgAsyncPreparedQuery<T>;
  prepareRelationalQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(): PgAsyncPreparedQuery<T>;
  transaction<T>(_transaction: (tx: PgAsyncTransaction<PgQueryResultHKT, Record<string, never>, EmptyRelations, Record<string, never>>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
interface PrismaPgQueryResultHKT extends PgQueryResultHKT {
  type: [];
}
//#endregion
export { PrismaPgPreparedQuery, PrismaPgQueryResultHKT, PrismaPgSession, PrismaPgSessionOptions };
//# sourceMappingURL=session.d.cts.map