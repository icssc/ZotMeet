import { AwsDataApiClient, AwsDataApiPgQueryResult, AwsDataApiPgQueryResultHKT } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { SQL, SQLWrapper } from "../../sql/sql.cjs";
import { DrizzleConfig, UpdateSet } from "../../utils.cjs";
import { AnyRelations, EmptyRelations } from "../../relations.cjs";
import { PgDialect } from "../../pg-core/dialect.cjs";
import { RDSDataClient, RDSDataClientConfig } from "@aws-sdk/client-rds-data";
import { Logger } from "../../logger.cjs";
import { PgAsyncDatabase } from "../../pg-core/async/db.cjs";
import { PgAsyncRaw } from "../../pg-core/async/raw.cjs";
import { PgInsertConfig, PgTable, TableConfig } from "../../pg-core/index.cjs";

//#region src/aws-data-api/pg/driver.d.ts
interface PgDriverOptions {
  logger?: Logger;
  cache?: Cache;
  database: string;
  resourceArn: string;
  secretArn: string;
}
interface DrizzleAwsDataApiPgConfig<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends DrizzleConfig<TSchema, TRelations> {
  database: string;
  resourceArn: string;
  secretArn: string;
}
declare class AwsDataApiPgDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends PgAsyncDatabase<AwsDataApiPgQueryResultHKT, TSchema, TRelations> {
  static readonly [entityKind]: string;
  execute<TRow extends Record<string, unknown> = Record<string, unknown>>(query: SQLWrapper | string): PgAsyncRaw<AwsDataApiPgQueryResult<TRow>>;
}
declare class AwsPgDialect extends PgDialect {
  static readonly [entityKind]: string;
  escapeParam(num: number): string;
  buildInsertQuery({
    table,
    values,
    onConflict,
    returning,
    select,
    withList
  }: PgInsertConfig<PgTable<TableConfig>>): SQL<unknown>;
  buildUpdateSet(table: PgTable<TableConfig>, set: UpdateSet): SQL<unknown>;
}
declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations, TClient extends AwsDataApiClient = RDSDataClient>(...params: [((DrizzleConfig<TSchema, TRelations> & {
  connection: RDSDataClientConfig & Omit<DrizzleAwsDataApiPgConfig, keyof DrizzleConfig>;
}) | (DrizzleAwsDataApiPgConfig<TSchema, TRelations> & {
  client: TClient;
}))]): AwsDataApiPgDatabase<TSchema, TRelations> & {
  $client: TClient;
};
declare namespace drizzle {
  function mock<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations>(config: DrizzleAwsDataApiPgConfig<TSchema, TRelations>): AwsDataApiPgDatabase<TSchema, TRelations> & {
    $client: '$client is not available on drizzle.mock()';
  };
}
//#endregion
export { AwsDataApiPgDatabase, AwsPgDialect, DrizzleAwsDataApiPgConfig, PgDriverOptions, drizzle };
//# sourceMappingURL=driver.d.cts.map