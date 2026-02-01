import { createClient } from "@libsql/client";
import { HttpClient } from "@libsql/client/http";
import { Sqlite3Client } from "@libsql/client/sqlite3";
import { WsClient } from "@libsql/client/ws";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";
import { LibSQLSession } from "./session.js";
class LibSQLDatabase extends BaseSQLiteDatabase {
  static [entityKind] = "LibSQLDatabase";
  async batch(batch) {
    return this.session.batch(batch);
  }
}
function construct(client, config = {}) {
  const dialect = new SQLiteAsyncDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new LibSQLSession(client, dialect, schema, { logger }, void 0);
  const db = new LibSQLDatabase("async", dialect, session, schema);
  db.$client = client;
  return db;
}
function drizzle(...params) {
  if (params[0] instanceof WsClient || params[0] instanceof HttpClient || params[0] instanceof Sqlite3Client) {
    return construct(params[0], params[1]);
  }
  if (typeof params[0] === "string") {
    const instance2 = createClient({
      url: params[0]
    });
    return construct(instance2, params[1]);
  }
  const { connection, client, ...drizzleConfig } = params[0];
  if (client)
    return construct(client, drizzleConfig);
  const instance = typeof connection === "string" ? createClient({ url: connection }) : createClient(connection);
  return construct(instance, drizzleConfig);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
export {
  LibSQLDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map