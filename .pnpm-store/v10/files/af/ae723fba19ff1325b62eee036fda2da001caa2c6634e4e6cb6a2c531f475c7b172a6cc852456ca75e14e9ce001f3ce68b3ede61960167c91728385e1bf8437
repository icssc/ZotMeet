import { entityKind } from "../../entity.cjs";
import { Query, SQL } from "../../sql/sql.cjs";
import { Assume } from "../../utils.cjs";
import { EmptyRelations } from "../../relations.cjs";
import { Logger } from "../../logger.cjs";
import { MySqlDialect, MySqlPreparedQuery, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlSession, MySqlTransaction, MySqlTransactionConfig } from "../../mysql-core/index.cjs";
import { PrismaClient } from "@prisma/client/extension";

//#region src/prisma/mysql/session.d.ts
declare class PrismaMySqlPreparedQuery<T> extends MySqlPreparedQuery<MySqlPreparedQueryConfig & {
  execute: T;
}> {
  private readonly prisma;
  private readonly query;
  private readonly logger;
  iterator(_placeholderValues?: Record<string, unknown> | undefined): AsyncGenerator<unknown, any, unknown>;
  static readonly [entityKind]: string;
  constructor(prisma: PrismaClient, query: Query, logger: Logger);
  execute(placeholderValues?: Record<string, unknown>): Promise<T>;
}
interface PrismaMySqlSessionOptions {
  logger?: Logger;
}
declare class PrismaMySqlSession extends MySqlSession {
  private readonly prisma;
  private readonly options;
  static readonly [entityKind]: string;
  private readonly logger;
  constructor(dialect: MySqlDialect, prisma: PrismaClient, options: PrismaMySqlSessionOptions);
  execute<T>(query: SQL): Promise<T>;
  all<T = unknown>(_query: SQL): Promise<T[]>;
  prepareQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(query: Query): MySqlPreparedQuery<T>;
  prepareRelationalQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(): MySqlPreparedQuery<T>;
  transaction<T>(_transaction: (tx: MySqlTransaction<PrismaMySqlQueryResultHKT, PrismaMySqlPreparedQueryHKT, Record<string, never>, EmptyRelations, Record<string, never>>) => Promise<T>, _config?: MySqlTransactionConfig): Promise<T>;
}
interface PrismaMySqlQueryResultHKT extends MySqlQueryResultHKT {
  type: [];
}
interface PrismaMySqlPreparedQueryHKT extends MySqlPreparedQueryHKT {
  type: PrismaMySqlPreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
//#endregion
export { PrismaMySqlPreparedQuery, PrismaMySqlPreparedQueryHKT, PrismaMySqlQueryResultHKT, PrismaMySqlSession, PrismaMySqlSessionOptions };
//# sourceMappingURL=session.d.cts.map