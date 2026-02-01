import { Client } from "@planetscale/database";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { PlanetscaleSession } from "./session.js";
class PlanetScaleDatabase extends MySqlDatabase {
  static [entityKind] = "PlanetScaleDatabase";
}
function construct(client, config = {}) {
  if (!(client instanceof Client)) {
    console.log(`Warning: You need to pass an instance of Client:

import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle(client);
		
Starting from version 0.30.0, you will encounter an error if you attempt to use anything other than a Client instance.
Please make the necessary changes now to prevent any runtime errors in the future
		`);
  }
  const dialect = new MySqlDialect({ casing: config.casing });
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
  const session = new PlanetscaleSession(client, dialect, void 0, schema, { logger });
  const db = new PlanetScaleDatabase(dialect, session, schema, "planetscale");
  db.$client = client;
  return db;
}
function drizzle(...params) {
  if (params[0] instanceof Client) {
    return construct(params[0], params[1]);
  }
  if (typeof params[0] === "object") {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client)
      return construct(client, drizzleConfig);
    const instance2 = typeof connection === "string" ? new Client({
      url: connection
    }) : new Client(
      connection
    );
    return construct(instance2, drizzleConfig);
  }
  const instance = new Client({
    url: params[0]
  });
  return construct(instance, params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
export {
  PlanetScaleDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map