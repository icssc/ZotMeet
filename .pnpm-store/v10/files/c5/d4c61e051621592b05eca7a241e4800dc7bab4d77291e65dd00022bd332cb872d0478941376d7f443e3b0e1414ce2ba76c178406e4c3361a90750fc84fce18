const require_postgres_js_session = require('./session.cjs');
const require_postgres_js_driver = require('./driver.cjs');

exports.PostgresJsDatabase = require_postgres_js_driver.PostgresJsDatabase;
exports.PostgresJsPreparedQuery = require_postgres_js_session.PostgresJsPreparedQuery;
exports.PostgresJsSession = require_postgres_js_session.PostgresJsSession;
exports.PostgresJsTransaction = require_postgres_js_session.PostgresJsTransaction;
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return require_postgres_js_driver.drizzle;
  }
});