import { PGlite } from "@electric-sql/pglite";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { PgliteSession } from "./session.js";
class PgliteDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [entityKind] = "PgliteDriver";
  createSession(schema) {
    return new PgliteSession(this.client, this.dialect, schema, { logger: this.options.logger });
  }
}
class PgliteDatabase extends PgDatabase {
  static [entityKind] = "PgliteDatabase";
}
function construct(client, config = {}) {
  const dialect = new PgDialect({ casing: config.casing });
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
  const driver = new PgliteDriver(client, dialect, { logger });
  const session = driver.createSession(schema);
  const db = new PgliteDatabase(dialect, session, schema);
  db.$client = client;
  return db;
}
function drizzle(...params) {
  if (params[0] instanceof PGlite) {
    return construct(params[0], params[1]);
  }
  if (typeof params[0] === "object") {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client)
      return construct(client, drizzleConfig);
    if (typeof connection === "object") {
      const { dataDir, ...options } = connection;
      const instance3 = new PGlite(dataDir, options);
      return construct(instance3, drizzleConfig);
    }
    const instance2 = new PGlite(connection);
    return construct(instance2, drizzleConfig);
  }
  const instance = new PGlite(params[0]);
  return construct(instance, params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
export {
  PgliteDatabase,
  PgliteDriver,
  drizzle
};
//# sourceMappingURL=driver.js.map