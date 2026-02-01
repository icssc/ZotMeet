const require_tidb_serverless_session = require('./session.cjs');
const require_tidb_serverless_driver = require('./driver.cjs');

exports.TiDBServerlessDatabase = require_tidb_serverless_driver.TiDBServerlessDatabase;
exports.TiDBServerlessPreparedQuery = require_tidb_serverless_session.TiDBServerlessPreparedQuery;
exports.TiDBServerlessSession = require_tidb_serverless_session.TiDBServerlessSession;
exports.TiDBServerlessTransaction = require_tidb_serverless_session.TiDBServerlessTransaction;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_tidb_serverless_driver.drizzle;
  }
});