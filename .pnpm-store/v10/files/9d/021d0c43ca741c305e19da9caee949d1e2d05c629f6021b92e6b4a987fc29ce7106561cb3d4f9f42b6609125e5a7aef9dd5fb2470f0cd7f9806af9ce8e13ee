const require_node_postgres_session = require('./session.cjs');
const require_node_postgres_driver = require('./driver.cjs');

exports.NodePgDatabase = require_node_postgres_driver.NodePgDatabase;
exports.NodePgPreparedQuery = require_node_postgres_session.NodePgPreparedQuery;
exports.NodePgSession = require_node_postgres_session.NodePgSession;
exports.NodePgTransaction = require_node_postgres_session.NodePgTransaction;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_node_postgres_driver.drizzle;
  }
});