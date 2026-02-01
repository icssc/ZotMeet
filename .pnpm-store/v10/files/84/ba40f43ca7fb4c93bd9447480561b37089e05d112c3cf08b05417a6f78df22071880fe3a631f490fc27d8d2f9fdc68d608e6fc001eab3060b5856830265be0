"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var driver_exports = {};
__export(driver_exports, {
  LibSQLDatabase: () => LibSQLDatabase,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_client = require("@libsql/client");
var import_http = require("@libsql/client/http");
var import_sqlite3 = require("@libsql/client/sqlite3");
var import_ws = require("@libsql/client/ws");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_relations = require("../relations.cjs");
var import_db = require("../sqlite-core/db.cjs");
var import_dialect = require("../sqlite-core/dialect.cjs");
var import_session = require("./session.cjs");
class LibSQLDatabase extends import_db.BaseSQLiteDatabase {
  static [import_entity.entityKind] = "LibSQLDatabase";
  async batch(batch) {
    return this.session.batch(batch);
  }
}
function construct(client, config = {}) {
  const dialect = new import_dialect.SQLiteAsyncDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new import_logger.DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = (0, import_relations.extractTablesRelationalConfig)(
      config.schema,
      import_relations.createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new import_session.LibSQLSession(client, dialect, schema, { logger }, void 0);
  const db = new LibSQLDatabase("async", dialect, session, schema);
  db.$client = client;
  return db;
}
function drizzle(...params) {
  if (params[0] instanceof import_ws.WsClient || params[0] instanceof import_http.HttpClient || params[0] instanceof import_sqlite3.Sqlite3Client) {
    return construct(params[0], params[1]);
  }
  if (typeof params[0] === "string") {
    const instance2 = (0, import_client.createClient)({
      url: params[0]
    });
    return construct(instance2, params[1]);
  }
  const { connection, client, ...drizzleConfig } = params[0];
  if (client)
    return construct(client, drizzleConfig);
  const instance = typeof connection === "string" ? (0, import_client.createClient)({ url: connection }) : (0, import_client.createClient)(connection);
  return construct(instance, drizzleConfig);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LibSQLDatabase,
  drizzle
});
//# sourceMappingURL=driver.cjs.map